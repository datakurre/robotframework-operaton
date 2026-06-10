"""Operaton Robot Framework Library — CPython proxy.

This module provides a dynamic Robot Framework library that delegates all
keyword calls to the Operaton GraalPy/JVM backend over XML-RPC.

Two operating modes are supported:

**Auto-spawn mode (default)**
    The library starts a fresh JVM Remote server on first import and tears it
    down when the Python process exits.  Set the ``OPERATON_JAR`` environment
    variable to the path of the ``operaton-bpm-extension-robot-*-fat.jar``
    file, or pass the ``jar`` argument::

        Library    Operaton    jar=/path/to/fat.jar

**Connect mode (persistent / faster iteration)**
    If a long-running Remote server is already running (e.g. started with
    ``make remote-shade``), skip the 20-30 s JVM startup by pointing the proxy
    at it.  Set the ``OPERATON_REMOTE`` environment variable::

        export OPERATON_REMOTE=http://127.0.0.1:8270

    Or pass the URI directly::

        Library    Operaton    remote=http://127.0.0.1:8270

    The proxy connects immediately and never spawns or stops a JVM process.
    The process engine lifecycle is still managed per-test via the
    ``Setup Process Engine`` / ``Teardown Process Engine`` keywords.
"""

import atexit
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any

from robot.api import logger
from robot.libraries.Remote import Remote


class Operaton:
    """Dynamic Robot Framework library proxying keywords to the GraalPy/JVM Remote server."""

    ROBOT_LIBRARY_SCOPE = "GLOBAL"
    ROBOT_LIBRARY_DOC_FORMAT = "TEXT"

    def __init__(
        self,
        jar: str = "",
        port: int = 0,
        timeout: int = 30,
        remote: str = "",
    ):
        """Initialize the Operaton proxy library.

        Args:
            jar: Path to the fat JAR. Defaults to ``OPERATON_JAR`` env var.
                 Ignored when connecting to an existing server.
            port: Port for the auto-spawned Remote server (0 = auto-select).
                  Ignored when connecting to an existing server.
            timeout: Seconds to wait for the JVM to start.
                     Ignored when connecting to an existing server.
            remote: URI of a pre-existing Remote server, e.g.
                    ``http://127.0.0.1:8270``.  Defaults to the
                    ``OPERATON_REMOTE`` environment variable.  When set, the
                    proxy connects immediately without spawning a JVM process.
        """
        self._proc: subprocess.Popen | None = None
        self._tmpdir: str | None = None
        self._remote: Remote | None = None

        remote_uri = remote or os.environ.get("OPERATON_REMOTE", "")
        if remote_uri:
            # Connect-only mode: attach to an existing Remote server.
            self._remote = Remote(uri=remote_uri)
            logger.info(f"Connected to existing Operaton Remote Server at {remote_uri}")
            return

        # Auto-spawn mode: start a fresh JVM Remote server.
        self._jar = jar or os.environ.get("OPERATON_JAR", "")
        if not self._jar:
            raise RuntimeError(
                "Operaton JAR not found. Set the OPERATON_JAR environment variable "
                "or pass jar=/path/to/operaton-bpm-extension-robot-fat.jar"
            )
        self._jar = str(Path(self._jar).resolve())
        if not Path(self._jar).is_file():
            raise RuntimeError(f"Operaton JAR not found at: {self._jar}")

        self._timeout = timeout
        self._port = port
        self._tmpdir = tempfile.mkdtemp(prefix="operaton-remote-")
        self._port_file = os.path.join(self._tmpdir, "port")

        self._start_server()
        atexit.register(self._shutdown)

    def _start_server(self):
        """Spawn the JVM Remote server process and wait for it to be ready."""
        java_cmd = shutil.which("java")
        if not java_cmd:
            java_home = os.environ.get("JAVA_HOME", "")
            if java_home:
                java_cmd = os.path.join(java_home, "bin", "java")
            else:
                raise RuntimeError(
                    "Java not found on PATH and JAVA_HOME not set. "
                    "JDK 21+ is required to run the Operaton library."
                )

        # When port=0 (auto), pre-select a free port on the CPython side.
        # Relying on GraalPy's socket.getsockname() after bind(port=0) can
        # return 0 instead of the OS-assigned port, causing the proxy to
        # connect to http://127.0.0.1:0.
        listen_port = self._port
        if listen_port == 0:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", 0))
                listen_port = s.getsockname()[1]

        cmd = [
            java_cmd,
            "-jar",
            self._jar,
            "--remote",
            "--port",
            str(listen_port),
            "--port-file",
            self._port_file,
        ]

        java_opts = os.environ.get("JAVA_OPTS", "")
        if java_opts:
            cmd = [java_cmd] + java_opts.split() + cmd[1:]

        self._proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.getcwd(),
        )

        # Wait for the port file to appear
        deadline = time.time() + self._timeout
        actual_port = None
        while time.time() < deadline:
            if self._proc.poll() is not None:
                stderr = self._proc.stderr.read().decode() if self._proc.stderr else ""
                raise RuntimeError(
                    f"Operaton JVM process exited with code {self._proc.returncode}.\n"
                    f"stderr: {stderr[:2000]}"
                )
            if os.path.exists(self._port_file):
                actual_port = Path(self._port_file).read_text().strip()
                if actual_port:
                    break
            time.sleep(0.2)

        if not actual_port:
            self._shutdown()
            raise RuntimeError(
                f"Operaton Remote Server did not start within {self._timeout}s. "
                f"Port file not created at {self._port_file}"
            )

        uri = f"http://127.0.0.1:{actual_port}"
        self._remote = Remote(uri=uri)
        logger.info(f"Connected to Operaton Remote Server at {uri}")

    def get_keyword_names(self) -> list:
        """Return keyword names from the Remote server."""
        assert self._remote is not None
        return self._remote.get_keyword_names()

    def run_keyword(
        self, name: str, args: tuple = (), kwargs: dict | None = None
    ) -> Any:
        """Execute a keyword on the Remote server."""
        assert self._remote is not None
        return self._remote.run_keyword(name, args, kwargs or {})

    def get_keyword_documentation(self, name: str) -> str:
        """Return keyword documentation from the Remote server."""
        assert self._remote is not None
        try:
            return self._remote.get_keyword_documentation(name)
        except Exception:
            return ""

    def get_keyword_arguments(self, name: str) -> list:
        """Return keyword arguments from the Remote server."""
        assert self._remote is not None
        try:
            return self._remote.get_keyword_arguments(name)
        except Exception:
            return ["*args"]

    def _shutdown(self):
        """Stop the JVM Remote server process (no-op in connect mode)."""
        if self._proc is None:
            # Connect mode: we do not own the server; leave it running.
            return
        if self._proc.poll() is None:
            try:
                # Try graceful stop via XML-RPC
                if self._remote:
                    try:
                        from robotremoteserver import stop_remote_server

                        port_text = Path(self._port_file).read_text().strip()
                        stop_remote_server(f"http://127.0.0.1:{port_text}")
                    except Exception:
                        pass
                # Give it a moment to shut down
                try:
                    self._proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    self._proc.terminate()
                    try:
                        self._proc.wait(timeout=3)
                    except subprocess.TimeoutExpired:
                        self._proc.kill()
            except Exception:
                pass
        # Clean up temp dir
        try:
            if self._tmpdir and os.path.isdir(self._tmpdir):
                shutil.rmtree(self._tmpdir, ignore_errors=True)
        except Exception:
            pass

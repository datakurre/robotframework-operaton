package org.operaton.bpm.extension.robot;

import java.io.IOException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.python.embedding.GraalPyResources;

/**
 * Starts a Robot Framework Remote Server hosting the Operaton keyword library.
 *
 * <p>This allows CPython-based tools (e.g. RobotCode VSCode extension) to execute Operaton keywords
 * over the XML-RPC Remote protocol while the actual library runs inside GraalPy with full Java
 * interop.
 *
 * <p>Usage: {@code java -jar fat.jar --remote [--port PORT] [--port-file PATH]}
 */
public class RobotRemote {
  private static final String PYTHON = "python";

  static void run(String[] args) {
    int port = 0;
    String portFile = "operaton-remote.port";

    // Parse --remote specific args (skip first "--remote" arg)
    for (int i = 1; i < args.length; i++) {
      if ("--port".equals(args[i]) && i + 1 < args.length) {
        port = Integer.parseInt(args[++i]);
      } else if (args[i].startsWith("--port=")) {
        port = Integer.parseInt(args[i].substring("--port=".length()));
      } else if ("--port-file".equals(args[i]) && i + 1 < args.length) {
        portFile = args[++i];
      } else if (args[i].startsWith("--port-file=")) {
        portFile = args[i].substring("--port-file=".length());
      }
    }

    System.out.println("Starting Operaton Remote Server...");
    System.out.println("  port: " + (port == 0 ? "auto" : port));
    System.out.println("  port-file: " + portFile);

    try (Context context =
        GraalPyResources.contextBuilder()
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .option("engine.WarnInterpreterOnly", "false")
            .build()) {
      context.getBindings(PYTHON).putMember("_remote_port", port);
      context.getBindings(PYTHON).putMember("_remote_port_file", portFile);
      context.getBindings(PYTHON).putMember("cwd", System.getProperty("user.dir"));
      Source source;
      try {
        source =
            Source.newBuilder(
                    PYTHON,
                    """
                    import os
                    import sys
                    import types

                    # Register a minimal sysconfig data stub so CPython's sysconfig.py
                    # does not try to load platform-specific _sysconfigdata variants that
                    # are unavailable in GraalPy's embedded VFS (e.g. from a Nix devenv).
                    _scd_stub = types.ModuleType('_sysconfigdata')
                    _scd_stub.build_time_vars = {}
                    sys.modules['_sysconfigdata'] = _scd_stub
                    # _PYTHON_SYSCONFIGDATA_NAME tells sysconfig._get_sysconfigdata_name()
                    # to return '_sysconfigdata', which is found in sys.modules above.
                    # Override unconditionally — the host env may carry a CPython path
                    # (e.g. from Nix devenv) that does not exist inside GraalPy's VFS.
                    os.environ['_PYTHON_SYSCONFIGDATA_NAME'] = '_sysconfigdata'

                    sys.path.insert(0, cwd)
                    sys.path.insert(1, os.path.join(cwd, "lib"))

                    from Operaton import Operaton
                    import robotremoteserver
                    from robotremoteserver import RobotRemoteServer
                    from xmlrpc.server import SimpleXMLRPCServer

                    # Patch robotremoteserver to preserve None over XML-RPC.
                    # By default it converts None → '' which loses the distinction
                    # between an absent variable and an empty-string variable.
                    _orig_server_init = robotremoteserver.StoppableXMLRPCServer.__init__
                    def _patched_server_init(self, host, port):
                        SimpleXMLRPCServer.__init__(self, (host, port), logRequests=False,
                                                   bind_and_activate=False, allow_none=True)
                        self._activated = False
                        self._stopper_thread = None
                    robotremoteserver.StoppableXMLRPCServer.__init__ = _patched_server_init

                    def _patched_handle_return_value(self, ret):
                        if ret is None:
                            return None
                        if isinstance(ret, (str, bytes)):
                            return self._handle_binary_result(ret)
                        if isinstance(ret, (int, float)):
                            return ret
                        if isinstance(ret, dict):
                            return {self._str(k): self._handle_return_value(v)
                                    for k, v in ret.items()}
                        try:
                            return [self._handle_return_value(item) for item in ret]
                        except TypeError:
                            return self._str(ret)
                    robotremoteserver.KeywordResult._handle_return_value = _patched_handle_return_value

                    def _patched_set_return(self, value):
                        value = self._handle_return_value(value)
                        if value is None:
                            self.data['return'] = None
                        elif value != '':
                            self.data['return'] = value
                    robotremoteserver.KeywordResult.set_return = _patched_set_return

                    library = Operaton()
                    RobotRemoteServer(
                        library,
                        host='127.0.0.1',
                        port=int(_remote_port),
                        port_file=_remote_port_file if _remote_port_file else None,
                        allow_remote_stop=True,
                    )
                    """,
                    "<internal>")
                .build();
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
      context.eval(source);
    } catch (PolyglotException e) {
      if (e.isExit()) {
        System.exit(e.getExitStatus());
      } else {
        throw e;
      }
    }
  }
}

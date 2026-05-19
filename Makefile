JAVA := $(shell which java)
JAVA_FILES := $(shell find . -name "*.java" -path "*/src/*" -not -path "./tmp/*" -type f)
JAR := target/operaton-bpm-extension-robot-1.0-SNAPSHOT.jar
JAR_FAT := target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar
JAR_VASARA := target/operaton-bpm-extension-robot-1.0-SNAPSHOT-vasara.jar
NATIVE_BIN := target/operaton-bpm-extension-robot
WATCH_PATHS := src/test/resources/example src/main/resources/org.graalvm.python.vfs/src
VFS_SRC := src/main/resources/org.graalvm.python.vfs/src
BPMN_RENDER_JS := src/main/resources/bpmn-render.js
DMN_RENDER_JS := src/main/resources/dmn-render.js
JS_SOURCES := src/main/js/src/render.mjs src/main/js/package.json

.PHONY: all
all: dist-fat

# ─── Build targets ───────────────────────────────────────────────────────────
# build   — thin JAR (dev / test classpath; not a distributable)
# dist-*  — distributable deliverables (fat JARs, native binary, wheel, docs)

# GraalPy's bundled sysconfig.py is missing try/except ImportError in
# _init_posix(), which causes ensurepip to fail with
# "No module named '_sysconfigdata__linux_x86_64-linux-gnu'".
# This target pre-creates a stub module in any cached GraalPy python-home
# directories so that ensurepip can succeed.
# On a fresh machine the first build still fails (cache not yet populated);
# run 'make build' a second time and it will succeed.
_SYSCONFIGDATA_STUB := build_time_vars = {'SOABI': 'cpython-312-x86_64-linux-gnu', 'EXT_SUFFIX': '.cpython-312-x86_64-linux-gnu.so'}
.PHONY: _fix-graalpy-sysconfig
_fix-graalpy-sysconfig:
	@for d in $(HOME)/.cache/org.graalvm.polyglot/python/python-home/*/lib/python3.12; do \
	  if [ -d "$$d" ] && [ ! -f "$$d/_sysconfigdata__linux_x86_64-linux-gnu.py" ]; then \
	    printf '$(value _SYSCONFIGDATA_STUB)\n' > "$$d/_sysconfigdata__linux_x86_64-linux-gnu.py"; \
	  fi; \
	done; true

.PHONY: build
build: _fix-graalpy-sysconfig
	mvn package -DskipTests

# Primary deliverable: standard fat JAR (all core keywords, no Vasara classes).
.PHONY: dist-fat
dist-fat: _fix-graalpy-sysconfig
	mvn -Pshade package -DskipTests

# Secondary deliverable: Vasara fat JAR (includes fi.jyu.vasara.* form customizations).
.PHONY: dist-vasara
dist-vasara: _fix-graalpy-sysconfig
	mvn -Pshade-vasara package -DskipTests

# Secondary deliverable: native binary (GraalVM native-image; slow to build).
.PHONY: dist-native
dist-native:
	mvn -Pnative package

# CPython proxy wheel (robotframework-operaton).
.PHONY: dist-wheel
dist-wheel:
	cd python && pip wheel --no-deps -w dist .

# Keyword HTML reference (docs/Operaton.html).
.PHONY: dist-docs
dist-docs:
	mkdir -p docs
	mvn -q -DskipTests package
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc docs/Operaton.html"

# Machine-readable keyword spec for RobotCode LSP (docs/Operaton.libspec).
.PHONY: dist-libspec
dist-libspec:
	mkdir -p docs
	mvn -q -DskipTests package
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc docs/Operaton.libspec"

.PHONY: clean
clean:
	mvn clean

# ─── JS bundle ───────────────────────────────────────────────────────────────
# Rebuild the bpmn-render.js bundle from source (requires node + npm on PATH).
# The built file is committed to the repo so callers don't need node at build time.

.PHONY: bpmn-render
bpmn-render: $(BPMN_RENDER_JS)

$(BPMN_RENDER_JS): $(JS_SOURCES)
	cd src/main/js && npm install && node esbuild.config.mjs

# The dmn-render.js script is self-contained (no external dependencies);
# it is maintained directly in src/main/resources/ and does not need bundling.

# ─── Test targets ────────────────────────────────────────────────────────────

# In a Nix/devenv shell: extract pre-built GraalPy VFS (venv + home) from the
# Nix-built fat JAR into target/classes/ before running tests.  The resources
# plugin only copies src/main/resources/ and does NOT delete extra files in
# target/classes/, so the extracted venv survives the process-resources phase.
.PHONY: _nix-venv-bootstrap
_nix-venv-bootstrap:
	@NIX_JAR=$$(grep -o '/nix/store/[^ ]*\.jar' result/bin/operaton-robot 2>/dev/null); \
	if [ -z "$$NIX_JAR" ]; then \
	  echo "ERROR: Nix-built JAR not found. Run 'nix build' first."; exit 1; \
	fi; \
	echo "Extracting GraalPy VFS from $$NIX_JAR ..."; \
	mkdir -p target/classes; \
	(cd target/classes && jar xf "$$NIX_JAR" \
	  org.graalvm.python.vfs/venv \
	  org.graalvm.python.vfs/home \
	  org.graalvm.python.vfs/fileslist.txt); \
	echo "Patching fileslist.txt for current src/ tree ..."; \
	LIST=target/classes/org.graalvm.python.vfs/fileslist.txt; \
	(cd src/main/resources && \
	  find org.graalvm.python.vfs/src -mindepth 1 | LC_ALL=C sort | while read p; do \
	    if [ -d "$$p" ]; then echo "/$$p/"; else echo "/$$p"; fi; \
	  done) | while read entry; do \
	    grep -qxF "$$entry" "$$LIST" || echo "$$entry" >> "$$LIST"; \
	done

.PHONY: test
ifdef IN_NIX_SHELL
test: _nix-venv-bootstrap
	mvn -Pnix test
else
test:
	mvn test
endif

.PHONY: check
ifdef IN_NIX_SHELL
check: _nix-venv-bootstrap
	mvn -Pnix verify
else
check:
	mvn verify
endif

# ─── Run targets ─────────────────────────────────────────────────────────────
# SUITE: path to .robot file
#   e.g. make run SUITE=src/test/resources/example/Example.robot
#
# run        — fat JAR (default; fast after first dist-fat)
# run-vasara — Vasara fat JAR
# run-native — native binary
# robot      — Maven classpath runner (no pre-built JAR needed)

.PHONY: run
run:
	$(JAVA) -jar $(JAR_FAT) $(SUITE)

.PHONY: run-vasara
run-vasara:
	$(JAVA) -jar $(JAR_VASARA) $(SUITE)

.PHONY: run-native
run-native:
	./$(NATIVE_BIN) $(SUITE)

.PHONY: robot
robot:
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot ${SUITE}"

# ─── Watch mode ──────────────────────────────────────────────────────────────
# Watches for .robot/.bpmn/.dmn/.py changes and re-runs on every save.
#
#   make watch                             — fat JAR in-process watcher, all suites (~1 s)
#   make watch SUITE=path/to.robot         — fat JAR in-process watcher, one suite
#   make watch-vasara                      — Vasara fat JAR watcher
#   make watch-dev                         — Maven classpath runner, rebuilds VFS on .py changes
#   make watch-native                      — native binary runner
#
# watch uses a persistent GraalPy context: the JVM starts once and Robot
# Framework is re-invoked in the same context on each file change (~1s re-run).
# On .py changes the context is recreated (~2-3s) and Python source is loaded
# from disk (no fat JAR rebuild needed during watch).
#
# .py changes:
#   watch        → context recreation only (~2-3s), disk-loaded Python
#   watch-dev    → VFS rebuild via mvn process-resources, then re-run
#   watch-native → warning only; run 'make dist-native' manually to bake .py changes in

.PHONY: watch
watch:
	$(JAVA) -jar $(JAR_FAT) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-vasara
watch-vasara:
	$(JAVA) -jar $(JAR_VASARA) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-dev
watch-dev:
	@echo "Watching: $(WATCH_PATHS)"
	@echo "Suite filter: $(or $(SUITE),<all>)"
	@echo "Press Ctrl+C to stop."
	@echo "─────────────────────────────────────────────"
	@while true; do \
	  CHANGED=$$(inotifywait -r -e modify,create --format '%f' \
	    --include '\.(robot|bpmn|dmn|py)$$' $(WATCH_PATHS) 2>/dev/null); \
	  echo ""; \
	  echo ">>> Changed: $$CHANGED"; \
	  if echo "$$CHANGED" | grep -q '\.py$$'; then \
	    echo ">>> Python source changed — recompiling VFS..."; \
	    mvn -q process-resources -DskipTests; \
	  fi; \
	  if [ -n "$(SUITE)" ]; then \
	    echo ">>> Running: $(SUITE)Test"; \
	    mvn -q test -Dtest=$(SUITE)Test 2>&1 | tail -20; \
	  else \
	    echo ">>> Running: all tests"; \
	    mvn -q test 2>&1 | tail -30; \
	  fi; \
	  echo "─────────────────────────────────────────────"; \
	done

.PHONY: watch-native
watch-native:
	@echo "Watching: $(WATCH_PATHS)"
	@echo "Suite: $(or $(SUITE),src/test/resources/example)"
	@echo "Runner: native binary  (.py changes require 'make dist-native' manually)"
	@echo "Press Ctrl+C to stop."
	@echo "─────────────────────────────────────────────"
	@while true; do \
	  CHANGED=$$(inotifywait -r -e modify,create --format '%f' \
	    --include '\.(robot|bpmn|dmn|py)$$' $(WATCH_PATHS) 2>/dev/null); \
	  echo ""; \
	  echo ">>> Changed: $$CHANGED"; \
	  if echo "$$CHANGED" | grep -q '\.py$$'; then \
	    echo ">>> WARNING: Python source changed — native binary is NOT updated."; \
	    echo ">>>          Run 'make dist-native' to bake the changes in, then restart watch-native."; \
	    echo "─────────────────────────────────────────────"; \
	    continue; \
	  fi; \
	  echo ">>> Running: $(or $(SUITE),src/test/resources/example)"; \
	  ./$(NATIVE_BIN) $(or $(SUITE),src/test/resources/example) 2>&1 | tail -20; \
	  echo "─────────────────────────────────────────────"; \
	done

# ─── Utility targets ─────────────────────────────────────────────────────────

.PHONY: format
format:
	google-java-format -i $(JAVA_FILES)

# ─── Remote server ───────────────────────────────────────────────────────────
# Starts the Operaton keyword library as a Robot Framework Remote Server.
# Other tools (RobotCode, plain CPython robot) connect via:
#   Library  Remote  http://127.0.0.1:<port>  WITH NAME  Operaton

.PHONY: remote
remote:
	$(JAVA) -jar $(JAR_FAT) --remote --port 8270 --port-file operaton-remote.port

.PHONY: remote-vasara
remote-vasara:
	$(JAVA) -jar $(JAR_VASARA) --remote --port 8270 --port-file operaton-remote.port

.PHONY: remote-dev
remote-dev:
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot --remote --port 8270 --port-file operaton-remote.port"

# ─── Python proxy wheel ──────────────────────────────────────────────────────

.PHONY: install-proxy
install-proxy:
	pip install -e python/

.PHONY: shell
shell:
	devenv shell

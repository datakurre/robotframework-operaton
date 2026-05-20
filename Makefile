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
all: help

.PHONY: help
help:  ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make [TARGET] [SUITE=path/to/Suite.robot]\n"} /^[a-zA-Z][a-zA-Z0-9_-]*:.*?##/ { printf "  %-18s %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)

##@ Build

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
build: _fix-graalpy-sysconfig  ## Thin JAR (dev/test classpath; not distributable)
	mvn package -DskipTests

.PHONY: dist-fat
dist-fat: _fix-graalpy-sysconfig  ## Standard fat JAR [primary deliverable]
	mvn -Pshade package -DskipTests

.PHONY: dist-vasara
dist-vasara: _fix-graalpy-sysconfig  ## Vasara fat JAR (includes fi.jyu.vasara.* form classes)
	mvn -Pshade-vasara package -DskipTests

.PHONY: dist-native
dist-native:  ## Native binary via GraalVM native-image (slow)
	mvn -Pnative package

.PHONY: dist-wheel
dist-wheel:  ## CPython proxy wheel → python/dist/
	cd python && pip wheel --no-deps -w dist .

.PHONY: dist-docs
dist-docs:  ## Keyword HTML reference → docs/Operaton.html
	mkdir -p docs
	mvn -q -DskipTests package
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc docs/Operaton.html"

.PHONY: dist-libspec
dist-libspec:  ## Keyword spec for RobotCode LSP → docs/Operaton.libspec
	mkdir -p docs
	mvn -q -DskipTests package
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc docs/Operaton.libspec"

.PHONY: clean
clean:  ## mvn clean
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

##@ Test / verify

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
test:  ## Run all JUnit + Robot suites
	mvn test
endif

.PHONY: check
ifdef IN_NIX_SHELL
check: _nix-venv-bootstrap
	mvn -Pnix verify
else
check:  ## mvn verify
	mvn verify
endif

##@ Run  (SUITE=path/to/Suite.robot)

.PHONY: run
run:  ## Fat JAR runner
	$(JAVA) -jar $(JAR_FAT) $(SUITE)

.PHONY: run-vasara
run-vasara:  ## Vasara fat JAR runner
	$(JAVA) -jar $(JAR_VASARA) $(SUITE)

.PHONY: run-native
run-native:  ## Native binary runner
	./$(NATIVE_BIN) $(SUITE)

.PHONY: robot
robot:  ## Maven classpath runner (no pre-built JAR needed)
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot ${SUITE}"

##@ Watch  (SUITE= optional; .py changes recreate context in ~2-3 s)

.PHONY: watch
watch:  ## Fat JAR in-process watcher (~1 s re-run)
	$(JAVA) -jar $(JAR_FAT) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-vasara
watch-vasara:  ## Vasara fat JAR watcher
	$(JAVA) -jar $(JAR_VASARA) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-dev
watch-dev:  ## Maven classpath watcher; rebuilds VFS on .py changes
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
watch-native:  ## Native binary watcher (.py changes require dist-native)
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

##@ Remote server  (XML-RPC on :8270)

# Starts the Operaton keyword library as a Robot Framework Remote Server.
# Other tools (RobotCode, plain CPython robot) connect via:
#   Library  Remote  http://127.0.0.1:<port>  WITH NAME  Operaton

.PHONY: remote
remote:  ## Fat JAR
	$(JAVA) -jar $(JAR_FAT) --remote --port 8270 --port-file operaton-remote.port

.PHONY: remote-vasara
remote-vasara:  ## Vasara fat JAR
	$(JAVA) -jar $(JAR_VASARA) --remote --port 8270 --port-file operaton-remote.port

.PHONY: remote-dev
remote-dev:  ## Maven classpath runner
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot --remote --port 8270 --port-file operaton-remote.port"

##@ Misc

.PHONY: format
format:  ## google-java-format all Java source files
	google-java-format -i $(JAVA_FILES)

.PHONY: install-proxy
install-proxy:  ## pip install -e python/
	pip install -e python/

.PHONY: shell
shell:  ## devenv shell
	devenv shell

JAVA := $(shell which java)
JAVA_FILES := $(shell find . -name "*.java" -path "*/src/*" -not -path "./tmp/*" -type f)
JAR := target/operaton-bpm-extension-robot-1.0-SNAPSHOT.jar
JAR_FAT := target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar
NATIVE_BIN := target/operaton-bpm-extension-robot
WATCH_PATHS := src/test/resources/example src/main/resources/org.graalvm.python.vfs/src
VFS_SRC := src/main/resources/org.graalvm.python.vfs/src
BPMN_RENDER_JS := src/main/resources/bpmn-render.js
JS_SOURCES := src/main/js/src/render.mjs src/main/js/package.json

.PHONY: all
all: build

# ─── Build targets ───────────────────────────────────────────────────────────

.PHONY: build
build:
	mvn package -DskipTests

.PHONY: shade
shade:
	mvn -Pshade package -DskipTests

.PHONY: native
native:
	mvn -Pnative package

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
# SUITE: path to .robot file (for run/run-shade/run-native/robot)
#   e.g. make run SUITE=src/test/resources/example/Example.robot

.PHONY: run
run: robot

.PHONY: robot
robot:
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot ${SUITE}"

.PHONY: run-shade
run-shade:
	$(JAVA) -jar $(JAR_FAT) $(SUITE)

.PHONY: run-native
run-native:
	./$(NATIVE_BIN) $(SUITE)

# ─── Watch mode ──────────────────────────────────────────────────────────────
# Watches for .robot/.bpmn/.dmn/.py changes and re-runs on every save.
#
#   make watch                             — Maven runner, all suites
#   make watch SUITE=Example               — Maven runner, one suite (class-name prefix)
#   make watch-shade                       — fat JAR in-process watcher, all suites
#   make watch-shade SUITE=path/to.robot   — fat JAR in-process watcher, one suite
#   make watch-native                      — native binary runner, all suites
#   make watch-native SUITE=path/to.robot  — native binary runner, one suite
#
# watch-shade uses a persistent GraalPy context: the JVM starts once and Robot
# Framework is re-invoked in the same context on each file change (~1s re-run).
# On .py changes the context is recreated; Python source is loaded from disk
# (no fat JAR rebuild needed during watch).
#
# .py changes:
#   watch        → VFS rebuild via mvn process-resources, then re-run
#   watch-shade  → context recreation only (~2-3s), disk-loaded Python
#   watch-native → warning only; run 'make native' manually to bake .py changes in

.PHONY: watch
watch:
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

.PHONY: watch-shade
watch-shade:
	$(JAVA) -jar $(JAR_FAT) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-native
watch-native:
	@echo "Watching: $(WATCH_PATHS)"
	@echo "Suite: $(or $(SUITE),src/test/resources/example)"
	@echo "Runner: native binary  (.py changes require 'make native' manually)"
	@echo "Press Ctrl+C to stop."
	@echo "─────────────────────────────────────────────"
	@while true; do \
	  CHANGED=$$(inotifywait -r -e modify,create --format '%f' \
	    --include '\.(robot|bpmn|dmn|py)$$' $(WATCH_PATHS) 2>/dev/null); \
	  echo ""; \
	  echo ">>> Changed: $$CHANGED"; \
	  if echo "$$CHANGED" | grep -q '\.py$$'; then \
	    echo ">>> WARNING: Python source changed — native binary is NOT updated."; \
	    echo ">>>          Run 'make native' to bake the changes in, then restart watch-native."; \
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

.PHONY: docs
docs:
	mkdir -p docs
	mvn -q -DskipTests package
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc docs/Operaton.html"

.PHONY: shell
shell:
	devenv shell
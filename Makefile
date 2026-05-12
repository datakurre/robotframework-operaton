JAVA := $(shell which java)
JAVA_FILES := $(shell find . -name "*.java" -path "*/src/*" -not -path "./tmp/*" -type f)
JAR := target/operaton-bpm-extension-robot-1.0-SNAPSHOT.jar
JAR_FAT := target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar
NATIVE_BIN := target/operaton-bpm-extension-robot
WATCH_PATHS := src/test/resources/example src/main/resources/org.graalvm.python.vfs/src
VFS_SRC := src/main/resources/org.graalvm.python.vfs/src

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

# ─── Test targets ────────────────────────────────────────────────────────────

.PHONY: test
test:
	mvn test

.PHONY: check
check:
	mvn verify

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
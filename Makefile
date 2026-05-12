JAVA := $(shell which java)
JAVA_FILES := $(shell find . -name "*.java" -path "*/src/*" -not -path "./tmp/*" -type f)
JAR := target/operaton-bpm-extension-robot-1.0-SNAPSHOT.jar
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
	$(JAVA) -jar $(JAR) $(SUITE)

.PHONY: run-native
run-native:
	./$(NATIVE_BIN) $(SUITE)

# ─── Watch mode ──────────────────────────────────────────────────────────────
# Watches for .robot/.bpmn/.dmn/.py changes and re-runs tests.
#   make watch                  — run all tests on any change
#   make watch SUITE=Example    — run only ExampleTest on change
#
# Context recreation (mvn compile) only triggered on .py changes.

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

# ─── Utility targets ─────────────────────────────────────────────────────────

.PHONY: format
format:
	google-java-format -i $(JAVA_FILES)

.PHONY: docs
docs:
	mkdir -p docs
	mvn -q -DskipTests package
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=runtime -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc docs/ProcessEngine.html"

.PHONY: shell
shell:
	devenv shell

.PHONY: shell
shell:
	devenv shell

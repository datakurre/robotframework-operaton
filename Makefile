JAVA = $(shell which java)
JAR := target/operaton-bpm-extension-robot-1.0-SNAPSHOT.jar
JAR_FAT := target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar
JAR_VASARA := target/operaton-bpm-extension-robot-1.0-SNAPSHOT-vasara.jar
NATIVE_BIN := target/operaton-bpm-extension-robot
WATCH_PATHS := src/test/resources/example src/main/resources/org.graalvm.python.vfs/src
VFS_SRC := src/main/resources/org.graalvm.python.vfs/src
BPMN_RENDER_JS := src/main/resources/bpmn-render.js
DMN_RENDER_JS := src/main/resources/dmn-render.js
JS_SOURCES := src/main/js/src/render.mjs src/main/js/package.json

# ─── Coverage submodule ──────────────────────────────────────────────────────
# The operaton-process-test-coverage library is vendored as a git submodule and
# built/installed into the local Maven repo (it is not published to Maven Central).
COVERAGE_SUBMODULE := third_party/operaton-process-test-coverage
COVERAGE_VERSION := 3.0.2-SNAPSHOT
COVERAGE_MARKER := $(HOME)/.m2/repository/org/operaton/community/process_test_coverage/operaton-process-test-coverage-engine-platform-7/$(COVERAGE_VERSION)/operaton-process-test-coverage-engine-platform-7-$(COVERAGE_VERSION).jar
COVERAGE_STATE_FILE := target/.coverage-lib-submodule-head

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
# On a fresh machine the cache can appear during the first Maven run;
# Maven targets therefore retry once after applying this patch again.
_SYSCONFIGDATA_STUB := build_time_vars = {"SOABI": "cpython-312-x86_64-linux-gnu", "EXT_SUFFIX": ".cpython-312-x86_64-linux-gnu.so"}
.PHONY: _fix-graalpy-sysconfig
_fix-graalpy-sysconfig:
	@for d in $(HOME)/.cache/org.graalvm.polyglot/python/python-home/*/lib/python3.12; do \
	  if [ -d "$$d" ]; then \
	    printf '$(value _SYSCONFIGDATA_STUB)\n' > "$$d/_sysconfigdata__linux_x86_64-linux-gnu.py"; \
	  fi; \
	done; true

define _run_maven_with_graalpy_retry
	@$(1) || { \
	  echo "Retrying $(2) after applying GraalPy sysconfig stub..."; \
	  $(MAKE) _fix-graalpy-sysconfig; \
	  $(1); \
	}
endef

.PHONY: build
build: _fix-graalpy-sysconfig coverage-lib  ## Thin JAR (dev/test classpath; not distributable)
	$(call _run_maven_with_graalpy_retry,mvn package -DskipTests,build)

.PHONY: dist-fat
dist-fat: _fix-graalpy-sysconfig coverage-lib  ## Standard fat JAR [primary deliverable]
	$(call _run_maven_with_graalpy_retry,mvn -Pshade package -DskipTests,dist-fat)

.PHONY: dist-vasara
dist-vasara: _fix-graalpy-sysconfig coverage-lib  ## Vasara fat JAR (includes fi.jyu.vasara.* form classes)
	$(call _run_maven_with_graalpy_retry,mvn -Pshade-vasara package -DskipTests,dist-vasara)

.PHONY: dist-native
dist-native: coverage-lib  ## Native binary via GraalVM native-image (slow)
	mvn -Pnative package

.PHONY: dist-wheel
dist-wheel:  ## CPython proxy wheel → python/dist/
	python3 -m build --wheel --outdir python/dist/ python/

DOCS_DIR ?= docs

.PHONY: dist-docs
dist-docs: coverage-lib  ## Keyword HTML reference → $(DOCS_DIR)/Operaton.html  [DOCS_DIR=docs]
	mkdir -p $(DOCS_DIR)
	$(call _run_maven_with_graalpy_retry,mvn -q -DskipTests package,dist-docs)
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc $(DOCS_DIR)/Operaton.html"

.PHONY: dist-libspec
dist-libspec: coverage-lib  ## Keyword spec for RobotCode LSP → $(DOCS_DIR)/Operaton.libspec  [DOCS_DIR=docs]
	mkdir -p $(DOCS_DIR)
	$(call _run_maven_with_graalpy_retry,mvn -q -DskipTests package,dist-libspec)
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Libdoc $(DOCS_DIR)/Operaton.libspec"

.PHONY: clean
clean:  ## mvn clean
	mvn clean

# ─── Coverage library (git submodule) ────────────────────────────────────────
# Builds operaton-process-test-coverage-core and -engine-platform-7 from the
# submodule and installs them into the local Maven repo. Other targets depend on
# this so the coverage keywords compile and bundle correctly.

.PHONY: coverage-lib
coverage-lib: coverage-submodule  ## Build & install the coverage submodule into the local Maven repo
	@HEAD=$$(git -C "$(COVERAGE_SUBMODULE)" rev-parse HEAD); \
	INSTALLED_HEAD=$$(cat "$(COVERAGE_STATE_FILE)" 2>/dev/null || true); \
	if [ ! -f "$(COVERAGE_MARKER)" ] || [ "$$HEAD" != "$$INSTALLED_HEAD" ]; then \
	  echo "Installing coverage library for submodule commit $$HEAD ..."; \
	  (cd "$(COVERAGE_SUBMODULE)" && ./mvnw -q -pl bom,extension/core,extension/engine-platform-7 -am install -Dmaven.test.skip=true -B); \
	  mkdir -p "$$(dirname "$(COVERAGE_STATE_FILE)")"; \
	  printf '%s\n' "$$HEAD" > "$(COVERAGE_STATE_FILE)"; \
	else \
	  echo "Coverage library already up-to-date for submodule commit $$HEAD."; \
	fi

.PHONY: coverage-submodule
coverage-submodule:
	@git config --global --add safe.directory "$$(pwd)" 2>/dev/null || true
	@git submodule sync -- "$(COVERAGE_SUBMODULE)"
	@git submodule update --init --recursive "$(COVERAGE_SUBMODULE)"

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
# _nix-venv-bootstrap: used only by flake.nix / 'nix build' sandbox (no network).
# Extracts the pre-built GraalPy VFS (venv+home) from the Nix-store JAR into
# target/classes/ and activates the -Pnix Maven profile (which skips the
# graalpy-maven-plugin download step).  Not needed for normal development.
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

.PHONY: compile
compile: _fix-graalpy-sysconfig coverage-lib  ## Compile Java + test sources (no tests executed)
	$(call _run_maven_with_graalpy_retry,mvn -q -DskipTests test-compile,compile)

.PHONY: test
test: _fix-graalpy-sysconfig coverage-lib  ## Run all JUnit + Robot suites
	$(call _run_maven_with_graalpy_retry,mvn test,test)

.PHONY: check
check: coverage-lib  ## mvn verify
	mvn verify

.PHONY: mypy
mypy:  ## Run MyPy on Python sources
	mypy --config-file mypy.ini python/src/Operaton
	mypy --config-file mypy.ini src/main/resources/org.graalvm.python.vfs/src/Operaton.py src/main/resources/org.graalvm.python.vfs/src/keywords

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
robot: coverage-lib  ## Maven classpath runner (no pre-built JAR needed)
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot ${SUITE}"

OUTPUTDIR ?= robot-results
.PHONY: ci-robot
ci-robot: coverage-lib  ## Maven classpath runner with --outputdir for CI  [OUTPUTDIR=robot-results SUITE=path]
	mkdir -p $(OUTPUTDIR)
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot --outputdir $(OUTPUTDIR) $(SUITE)"

##@ Watch  (SUITE= optional; .py changes recreate context in ~2-3 s)

.PHONY: watch
watch:  ## Fat JAR in-process watcher (~1 s re-run)
	$(JAVA) -jar $(JAR_FAT) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-vasara
watch-vasara:  ## Vasara fat JAR watcher
	$(JAVA) -jar $(JAR_VASARA) --watch $(or $(SUITE),src/test/resources/example)

.PHONY: watch-dev
watch-dev: coverage-lib  ## Maven classpath watcher; rebuilds VFS on .py changes
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

##@ Nix lockfiles (mvn2nix offline dependencies)

.PHONY: mvn2nix.lock
mvn2nix.lock:  ## Generate mvn2nix.lock for main project dependencies
	nix run gitlab:vasara-bpm/mvn2nix -- pom.xml --goals=dependency:go-offline --repositories=file://$(HOME)/.m2/repository --repositories=https://repo.maven.apache.org/maven2/ > mvn2nix.lock

.PHONY: operaton-process-test-coverage.lock
operaton-process-test-coverage.lock: coverage-submodule  ## Generate mvn2nix lock for coverage library submodule
	nix run gitlab:vasara-bpm/mvn2nix -- $(COVERAGE_SUBMODULE)/pom.xml --goals="dependency:go-offline -pl bom,extension/core,extension/engine-platform-7 -am" > operaton-process-test-coverage.lock

.PHONY: mvn2nix-locks
mvn2nix-locks: mvn2nix.lock operaton-process-test-coverage.lock  ## Generate both mvn2nix lock files (main + coverage)

##@ Remote server  (XML-RPC on :8270)

# ─── Remote server ───────────────────────────────────────────────────────────
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
remote-dev: coverage-lib  ## Maven classpath runner
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot --remote --port 8270 --port-file operaton-remote.port"

##@ Misc

.PHONY: format
format:  ## Format sources with treefmt
	treefmt

.PHONY: format-check
format-check:  ## Verify formatting with treefmt --ci
	treefmt --ci

.PHONY: install-proxy
install-proxy:  ## pip install -e python/
	pip install -e python/

.PHONY: shell
shell:  ## devenv shell
	devenv shell

devenv-%:  ## Run make target inside devenv shell (e.g. devenv-test)
	devenv shell $(DEVENV_OPTIONS) -- $(MAKE) $*

nix-%:  ## Run make target inside devenv shell (e.g. nix-test)
	devenv shell $(DEVENV_OPTIONS) -- $(MAKE) $*

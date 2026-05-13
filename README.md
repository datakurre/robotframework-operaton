# robotframework-operaton

A [Robot Framework](https://robotframework.org/) library for acceptance-testing
[Operaton BPM](https://operaton.org/) processes and DMN decisions, powered by
[GraalPy](https://www.graalvm.org/python/) (GraalVM's Python implementation).

Write `.robot` tests that drive an in-memory Operaton process engine — deploy
BPMN/DMN, start instances, complete tasks, evaluate decisions, advance the
clock, assert on history and incidents — without leaving your test suite.

---

## Prerequisites

The project uses [devenv.sh](https://devenv.sh/) to manage the JDK, Maven and
other tools. Inside the devenv shell everything you need is on `PATH`:

```sh
devenv shell
```

Or run individual commands without an interactive shell:

```sh
devenv shell --no-eval-cache -- mvn test
```

(The repository ships with a working dev container; if you open it in VS Code
you are already inside the shell.)

---

## Minimal example

A complete Robot test that boots an engine, deploys a BPMN file, starts an
instance and asserts a user task is waiting:

```robot
*** Settings ***
Library    Operaton

*** Test Cases ***
First Run
    [Setup]       Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-project-process
    Should Have Task    ${instance}    say-hello
```

The matching `process.bpmn` is a single `start → user task → end` model with
process key `my-project-process` and user task key `say-hello`.

See [src/test/resources/example/](src/test/resources/example/) for many more
examples: DMN decisions, hit policies, external tasks, message/signal events,
timers and history queries.

---

## Running the tests

```sh
# All 16 Robot suites via JUnit:
devenv shell --no-eval-cache -- mvn test

# A single suite directly via the Robot CLI:
devenv shell --no-eval-cache -- make robot SUITE=src/test/resources/example/Example.robot
```

The first build downloads Robot Framework into the GraalPy virtual filesystem
(via `graalpy-maven-plugin`) and may take a few minutes.

---

## Running with `nix run`

The Nix flake exposes the fat JAR as a runnable app. No devenv shell or Maven
required — Nix fetches everything from the binary cache.

```sh
# Run a single Robot suite (output written to the current directory):
nix run github:operaton/operaton-robot -- src/test/resources/example/Example.robot

# Run all suites in a directory:
nix run github:operaton/operaton-robot -- src/test/resources/example

# Pass Robot Framework options:
nix run github:operaton/operaton-robot -- \
    --outputdir /tmp/results \
    --loglevel DEBUG \
    src/test/resources/example/Example.robot

# Watch mode — rerun on every .robot/.bpmn/.dmn/.py change:
nix run github:operaton/operaton-robot -- --watch src/test/resources/example

# Watch mode with explicit Python source directory
# (picks up .py edits live without rebuilding):
nix run github:operaton/operaton-robot -- \
    --watch src/test/resources/example \
    --py-src src/main/resources/org.graalvm.python.vfs/src
```

When working inside a checkout, replace `github:operaton/operaton-robot` with `.`:

```sh
nix run . -- src/test/resources/example/Example.robot
nix run . -- --watch src/test/resources/example
```

`JAVA_OPTS` is forwarded to the JVM:

```sh
JAVA_OPTS="-Xmx2g" nix run . -- src/test/resources/example/Example.robot
```

### Watch mode details

`--watch` keeps one GraalPy context alive across runs, so re-runs after
`.robot`/`.bpmn`/`.dmn` changes take roughly 1 second. On `.py` changes the
context is recreated (~2-3 s) and the updated sources are loaded from disk
when `--py-src` points at the on-disk VFS source directory.

| Flag | Default | Description |
|---|---|---|
| `--watch [path]` | `src/test/resources/example` | Suite file or directory to watch and run |
| `--py-src <dir>` | auto-detected if `src/main/resources/org.graalvm.python.vfs/src` exists | Load Python keywords from disk instead of VFS |

---

## Keyword overview

The `Operaton` library exposes ~44 keywords. The most common ones:

| Group | Keywords |
|---|---|
| Engine lifecycle | `Setup Process Engine`, `Teardown Process Engine` |
| Deployment | `Deploy Resources` |
| Instances | `Start Instance`, `Start Instance With Variables`, `Suspend Instance`, `Activate Instance` |
| Tasks | `Should Have Task`, `Complete Task`, `Get Tasks`, `Should Have N Active Tasks` |
| Variables | `Get Variable`, `Set Variable`, typed `Create Integer/Double/Boolean/Date Variable` |
| Assertions | `Should Be Active`, `Should Be Suspended`, `Should Be Ended`, `Should Have Incident` |
| Events | `Correlate Message`, `Send Message`, `Signal Event`, `Throw Signal` |
| External tasks | `Fetch And Lock`, `Complete External Task`, `Throw Bpmn Error` |
| DMN | `Evaluate Decision`, `Evaluate Decision Table`, `Decision Result Should Contain`, `Decision Single Result`, `Decision Single Entry`, `Collect Entries` |
| Clock / timers | `Set Clock`, `Advance Clock`, `Reset Clock`, `Execute Timer Jobs` |
| History | `Get Completed Instances`, `Get Historic Variables` |

The full library source is [src/main/resources/org.graalvm.python.vfs/src/Operaton.py](src/main/resources/org.graalvm.python.vfs/src/Operaton.py).

---

## Logging

By default the library runs quietly — Operaton engine messages (database
creation, schema setup, engine lifecycle) are suppressed. Only warnings and
errors from the process engine are shown.

To enable verbose engine output, pass Robot Framework's standard
`--loglevel DEBUG` (or `--loglevel TRACE`) option. The library detects this
flag and promotes the Java log level to `INFO`:

```sh
# Via nix run
nix run . -- --loglevel DEBUG src/test/resources/example/Example.robot

# Via Maven runner
devenv shell --no-eval-cache -- make robot SUITE=src/test/resources/example/Example.robot -- --loglevel DEBUG

# Via fat JAR directly
java -jar target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar \
    --loglevel DEBUG src/test/resources/example/Example.robot

# Via make run-shade
devenv shell --no-eval-cache -- make run-shade SUITE="--loglevel DEBUG src/test/resources/example/Example.robot"
```

The `--loglevel` value controls Robot Framework's own output verbosity *and*
gates the Operaton/Java log level simultaneously:

| `--loglevel` value | Robot output | Operaton engine logs |
|---|---|---|
| *(not set)* / `INFO` / `WARN` | default | suppressed (WARN+) |
| `DEBUG` or `TRACE` | verbose | INFO+ (full engine output) |

---

## RobotCode / VS Code integration

The Operaton library runs on GraalPy (not CPython), but can be used seamlessly
with the [RobotCode](https://robotcode.io/) VS Code extension for keyword
discovery (completions, hover, go-to-definition) and test execution.

### How it works

1. **LSP keyword discovery** — a generated `Operaton.libspec` file provides
   RobotCode's language server with full keyword signatures and documentation.
2. **Test execution** — a CPython proxy package (`robotframework-operaton`)
   auto-spawns the JVM fat JAR as a Robot Framework Remote Server and delegates
   all keyword calls over XML-RPC.

### Setup

```sh
# 1. Build the fat JAR (one-time)
devenv shell --no-eval-cache -- mvn -Pshade package -DskipTests

# 2. Generate the libspec (for LSP keyword discovery)
devenv shell --no-eval-cache -- make libspec

# 3. Install the CPython proxy
pip install -e python/
```

The repository includes a [`robot.toml`](robot.toml) that configures RobotCode:

```toml
paths = ["src/test/resources/example"]

[env]
OPERATON_JAR = "target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar"

[tool.robotcode-analyze.cache]
ignored-libraries = ["Operaton"]
```

Key settings:
- `OPERATON_JAR` tells the proxy where to find the fat JAR
- `ignored-libraries` prevents RobotCode from importing the library during
  analysis (which would start a JVM); the `.libspec` provides keyword info

### Usage in VS Code

Once configured, open any `.robot` file that uses `Library  Operaton`. You get:

- **Keyword completions** — all 44 keywords with argument signatures
- **Hover documentation** — docstrings from `Operaton.py`
- **Run Test** — click the gutter play button; the proxy auto-starts the JVM,
  runs the test, and shows results in the Test Results panel
- **Debug** — Robot-level breakpoints work (Python-side); Java keyword
  internals are opaque

### Remote server (standalone)

You can also run the Remote server manually for use with any Robot Framework
runner:

```sh
# Start the server on port 8270
make remote

# Or via the fat JAR directly
java -jar target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar \
    --remote --port 8270
```

Then reference it in your suite:

```robot
*** Settings ***
Library    Remote    http://127.0.0.1:8270    WITH NAME    Operaton
```

### Faster iteration in VS Code (persistent Remote server)

By default the CPython proxy spawns a fresh JVM for every test run, which
takes 20–30 seconds. For rapid edit-run cycles, keep one Remote server running
in a terminal and point the proxy at it — each "Run Test" in RobotCode then
connects instantly.

**Step 1 — start the server once (keep it running):**

```sh
make remote-shade        # fat JAR, port 8270 (fastest)
# or: make remote        # Maven classpath runner
```

**Step 2 — tell the proxy to connect instead of spawning:**

Uncomment the `OPERATON_REMOTE` line in `robot.toml`:

```toml
[env]
OPERATON_JAR = "target/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar"
OPERATON_REMOTE = "http://127.0.0.1:8270"
```

Or set it as a shell variable before running:

```sh
OPERATON_REMOTE=http://127.0.0.1:8270 robot src/test/resources/example/Example.robot
```

The engine lifecycle is still managed per-test via the `Setup Process Engine` /
`Teardown Process Engine` keywords — the persistent server does not affect test
isolation.

To revert to auto-spawn mode, comment out `OPERATON_REMOTE` (or unset the env
var).

---

## Native image (optional)

To compile a standalone native executable (requires a GraalVM JDK with Native
Image support):

```sh
devenv shell --no-eval-cache -- mvn -Pnative package
```

---

## License

Apache 2.0.

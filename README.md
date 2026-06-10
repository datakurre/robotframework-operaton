# robotframework-operaton

A [Robot Framework](https://robotframework.org/) library for acceptance-testing
[Operaton BPM](https://operaton.org/) processes and DMN decisions, powered by
[GraalPy](https://www.graalvm.org/python/) (GraalVM's Python implementation).

Write `.robot` tests that drive an in-memory Operaton process engine — deploy
BPMN/DMN, start instances, complete tasks, evaluate decisions, advance the
clock, assert on history and incidents — without leaving your test suite.

## Distributions

Two fat JARs are published with every release:

| Classifier | File | Contents |
|---|---|---|
| `fat` | `operaton-bpm-extension-robot-<version>-fat.jar` | Standard distribution — all core keywords |
| `vasara` | `operaton-bpm-extension-robot-<version>-vasara.jar` | Vasara form customizations included (`fi.jyu.vasara.*`) |

**Standard JAR** (`-fat.jar`) — use this for projects that manage form field
types and validators themselves.

**Vasara JAR** (`-vasara.jar`) — automatically activates when on the classpath:
- Custom form field types: `json` (Spin-backed), null-safe `date`, flexible `number` (Long/Double/String)
- No-op `pattern` and `type` validators (form submission never blocked by constraint mismatches)
- BPMN parse listeners that pre-initialise start event and user task form variables and inject a `taskAssignee` local variable on assignment
- Additional keywords: `Submit Task Form`, `Get Task Form Variables`

Both JARs are self-contained and require only Java 21+.

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
    Start Instance    my-project-process
    Should Have Task    say-hello
    Complete Task    say-hello
    Should Be Ended
```

After `Start Instance`, the library tracks the instance automatically — no
need to store the return value in a variable for subsequent keywords.

When you need to work with multiple instances in one test (rare), pass the
stored ID as the optional trailing `process_instance_id` argument:

```robot
    ${a}=    Start Instance    my-process
    ${b}=    Start Instance    my-process
    Should Have Task    say-hello    ${a}
    Should Have Task    say-hello    ${b}
    Complete Task    say-hello    ${a}
    Should Be Ended    ${a}
```

The matching `process.bpmn` is a single `start → user task → end` model with
process key `my-project-process` and user task key `say-hello`.

See [src/test/resources/example/](src/test/resources/example/) for many more
examples: DMN decisions, hit policies, external tasks, message/signal events,
timers and history queries.

---

## VS Code / RobotCode integration

The recommended way to write and run Operaton Robot tests is with the
[RobotCode](https://robotcode.io/) VS Code extension. Keyword completions,
hover documentation, and the **Run Test** gutter button all work out of the box.

### Prerequisites

- **Java 21+** on `PATH` (or `JAVA_HOME` set)
- **Node.js 18+** on `PATH` — optional; required only for `Log Bpmn Execution` and
  `Log Dmn Result` (diagram rendering). If `node` is absent those keywords log a
  warning and skip rendering without failing the test.

### 1. Get the fat JAR and libspec

**From a release** — download from the
[GitLab Releases](https://gitlab.com/vasara-bpm/robotframework-operaton/-/releases) page:

- `operaton-bpm-extension-robot-<version>-fat.jar` (standard) **or**
  `operaton-bpm-extension-robot-<version>-vasara.jar` (with Vasara form customizations)
  → place it anywhere convenient (e.g. `lib/`)
- `Operaton.libspec` → place it in `docs/` in your project root

**From source** — requires Java 21, Maven, and [devenv](https://devenv.sh/):

```sh
make dist-fat       # → target/*-fat.jar
make dist-vasara    # → target/*-vasara.jar
make dist-libspec   # → docs/Operaton.libspec
```

Format checks are standardized via treefmt:

```sh
devenv shell --no-eval-cache -- make format        # apply formatting
devenv shell --no-eval-cache -- make format-check  # verify formatting (CI mode)
```

### 2. Install the CPython proxy

```sh
pip install -e python/
```

### 3. Configure `robot.toml`

The repository ships with a [`robot.toml`](robot.toml) that wires everything
together. Adjust `OPERATON_JAR` to match where you placed the fat JAR:

```toml
paths = ["src/test/resources/example"]

[env]
OPERATON_JAR = "lib/operaton-bpm-extension-robot-1.0-fat.jar"
# GraalPy JVM startup takes ~20-30s; raise RobotCode's library-load timeout accordingly.
ROBOTCODE_LOAD_LIBRARY_TIMEOUT = "120"

[tool.robotcode-analyze.cache]
ignored-libraries = ["Operaton"]
```

`ignored-libraries` prevents RobotCode from importing the library during static
analysis (which would start a JVM); the `.libspec` provides keyword information
instead.

### Usage in VS Code

Open any `.robot` file that uses `Library  Operaton`. You get:

- **Keyword completions** — all 44 keywords with argument signatures
- **Hover documentation** — docstrings from `Operaton.py`
- **Run Test** — click the gutter play button; the proxy auto-starts the JVM,
  runs the test, and shows results in the Test Results panel
- **Debug** — Robot-level breakpoints work (Python-side); Java keyword
  internals are opaque

### Faster iteration (persistent Remote server)

By default the CPython proxy spawns a fresh JVM for every test run (~20–30 s).
For rapid edit-run cycles, keep one Remote server running and point the proxy
at it — each **Run Test** then connects instantly.

#### Option A: VS Code Command (recommended)

Use the **[vscode-operaton-robotframework](https://gitlab.com/vasara-bpm/vscode-operaton-robotframework)** companion extension:

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run **Operaton Robot: Start Remote Server**

The extension:
- Spawns the JVM server in a visible VS Code terminal (you can see logs)
- Auto-selects a free port (no conflicts)
- Updates `robot.toml` with `OPERATON_REMOTE = "http://127.0.0.1:<port>"` automatically
- Shows a status bar indicator: `$(server-process) Operaton :PORT` — click it to stop

When you're done, click the status bar item or run **Operaton Robot: Stop Remote Server**
from the Command Palette. The extension removes `OPERATON_REMOTE` from `robot.toml`,
so subsequent runs fall back to auto-spawning.

#### Option B: Manual terminal

**Start the server once (keep the terminal open):**

```sh
java -jar lib/operaton-bpm-extension-robot-1.0-fat.jar --remote --port 8270
```

**Tell the proxy to connect instead of spawning:**

Uncomment `OPERATON_REMOTE` in `robot.toml`:

```toml
[env]
OPERATON_JAR    = "lib/operaton-bpm-extension-robot-1.0-fat.jar"
OPERATON_REMOTE = "http://127.0.0.1:8270"
```

Or set it as a shell variable:

```sh
OPERATON_REMOTE=http://127.0.0.1:8270 robot path/to/Suite.robot
```

#### How it works

The engine lifecycle is still managed per-test via `Setup Process Engine` /
`Teardown Process Engine` — the persistent server does not affect test isolation.
Each test gets a fresh in-memory engine; the JVM process simply stays warm
between runs, eliminating GraalPy startup overhead.

---

## Running with `java -jar`

Download the fat JAR from [GitLab Releases](https://gitlab.com/vasara-bpm/robotframework-operaton/-/releases)
(`-fat.jar` for the standard distribution, `-vasara.jar` to include Vasara form customizations).
Java 21+ is the only prerequisite.

```sh
# Run a single suite (output written to the current directory):
java -jar operaton-bpm-extension-robot-1.0-fat.jar path/to/Suite.robot

# Run all suites in a directory:
java -jar operaton-bpm-extension-robot-1.0-fat.jar path/to/

# Pass Robot Framework options:
java -jar operaton-bpm-extension-robot-1.0-fat.jar \
    --outputdir /tmp/results \
    --loglevel DEBUG \
    path/to/Suite.robot

# Start as a Remote server for CPython/RobotCode:
java -jar operaton-bpm-extension-robot-1.0-fat.jar --remote --port 8270

# Watch mode — rerun on every .robot/.bpmn/.dmn change (~1 s):
java -jar operaton-bpm-extension-robot-1.0-fat.jar --watch path/to/

# Watch mode with live Python source edits (~2-3 s on .py changes):
java -jar operaton-bpm-extension-robot-1.0-fat.jar \
    --watch path/to/ \
    --py-src src/main/resources/org.graalvm.python.vfs/src
```

`JAVA_OPTS` is forwarded to the JVM:

```sh
JAVA_OPTS="-Xmx2g" java -jar operaton-bpm-extension-robot-1.0-fat.jar path/to/Suite.robot
```

### Watch mode details

`--watch` keeps one GraalPy context alive across runs, so re-runs after
`.robot`/`.bpmn`/`.dmn` changes take roughly 1 second. On `.py` changes the
context is recreated (~2–3 s) and updated sources are loaded from disk when
`--py-src` points at the on-disk VFS source directory.

| Flag | Default | Description |
|---|---|---|
| `--watch [path]` | `src/test/resources/example` | Suite file or directory to watch and run |
| `--py-src <dir>` | auto-detected if `src/main/resources/org.graalvm.python.vfs/src` exists | Load Python keywords from disk instead of VFS |

---

## Running with `nix run` (CI / no install)

The Nix flake exposes the fat JAR as a runnable app. No JDK, Maven, or manual
download required — Nix fetches everything from the binary cache, making it
ideal for CI pipelines.

```sh
# Run a single Robot suite (output written to the current directory):
nix run gitlab:vasara-bpm/robotframework-operaton -- src/test/resources/example/Example.robot

# Run all suites in a directory:
nix run gitlab:vasara-bpm/robotframework-operaton -- src/test/resources/example

# Pass Robot Framework options:
nix run gitlab:vasara-bpm/robotframework-operaton -- \
    --outputdir /tmp/results \
    --loglevel DEBUG \
    src/test/resources/example/Example.robot

# Watch mode — rerun on every .robot/.bpmn/.dmn/.py change:
nix run gitlab:vasara-bpm/robotframework-operaton -- --watch src/test/resources/example

# Watch mode with explicit Python source directory
# (picks up .py edits live without rebuilding):
nix run gitlab:vasara-bpm/robotframework-operaton -- \
    --watch src/test/resources/example \
    --py-src src/main/resources/org.graalvm.python.vfs/src
```

When working inside a checkout, replace `gitlab:vasara-bpm/robotframework-operaton` with `.`:

```sh
nix run . -- src/test/resources/example/Example.robot
nix run . -- --watch src/test/resources/example
```

`JAVA_OPTS` is forwarded to the JVM:

```sh
JAVA_OPTS="-Xmx2g" nix run . -- src/test/resources/example/Example.robot
```

---

## Keyword overview

The `Operaton` library exposes ~44 keywords. The most common ones:

| Group | Keywords | JAR |
|---|---|---|
| Engine lifecycle | `Setup Process Engine`, `Teardown Process Engine` | both |
| Deployment | `Deploy Resources` | both |
| Instances | `Start Instance`, `Start Instance With Variables`, `Suspend Instance`, `Activate Instance` | both |
| Tasks | `Should Have Task`, `Complete Task`, `Get Tasks`, `Should Have N Active Tasks` | both |
| Variables | `Get Variable`, `Set Variable`, typed `Create Integer/Double/Boolean/Date Variable` | both |
| Assertions | `Should Be Active`, `Should Be Suspended`, `Should Be Ended`, `Should Have Incident` | both |
| Events | `Correlate Message`, `Send Message`, `Signal Event`, `Throw Signal` | both |
| External tasks | `Fetch And Lock`, `Complete External Task`, `Throw Bpmn Error` | both |
| DMN | `Evaluate Decision`, `Evaluate Decision Table`, `Decision Result Should Contain`, `Decision Single Result`, `Decision Single Entry`, `Collect Entries` | both |
| Clock / timers | `Set Clock`, `Advance Clock`, `Reset Clock`, `Execute Timer Jobs` | both |
| History | `Get Completed Instances`, `Get Historic Variables` | both |
| Visualization *(Node.js required)* | `Log Bpmn Execution`, `Log Dmn Result` | both |
| Forms (Vasara) | `Submit Task Form`, `Get Task Form Variables` | vasara only |

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
# Via java -jar
java -jar operaton-bpm-extension-robot-1.0-fat.jar \
    --loglevel DEBUG path/to/Suite.robot

# Via nix run
nix run . -- --loglevel DEBUG src/test/resources/example/Example.robot
```

The `--loglevel` value controls Robot Framework's own output verbosity *and*
gates the Operaton/Java log level simultaneously:

| `--loglevel` value | Robot output | Operaton engine logs |
|---|---|---|
| *(not set)* / `INFO` / `WARN` | default | suppressed (WARN+) |
| `DEBUG` or `TRACE` | verbose | INFO+ (full engine output) |

---

## Contributing

See [AGENTS.md](AGENTS.md) for the full development guide: architecture,
build setup, adding keywords, test conventions, Makefile targets, and version
upgrade procedures.

See [UPGRADE.md](UPGRADE.md) for step-by-step instructions on bumping
dependency versions in Maven and Nix.

---

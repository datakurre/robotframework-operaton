# robotframework-operaton

A CPython proxy package for the [Operaton Robot Framework library](https://gitlab.com/vasara-bpm/robotframework-operaton).

This package auto-spawns the GraalPy/JVM backend as a Robot Framework Remote
Server and delegates all keyword calls over XML-RPC. It allows you to use the
Operaton library with standard CPython tools like RobotCode (VS Code extension),
`robotcode` CLI, and any other Robot Framework runner.

## Installation

```bash
pip install robotframework-operaton
```

## Prerequisites

- **Java 21+** on `PATH` (or `JAVA_HOME` set)
- The fat JAR: `operaton-bpm-extension-robot-*-fat.jar`
  - Build with: `mvn -Pshade package -DskipTests` in the main repo
  - Or download from releases

## Configuration

### Auto-spawn mode (default)

Set the `OPERATON_JAR` environment variable to point at the fat JAR:

```bash
export OPERATON_JAR=/path/to/operaton-bpm-extension-robot-1.0-SNAPSHOT-fat.jar
```

Or pass it as a library argument in your Robot suite:

```robot
*** Settings ***
Library    Operaton    jar=/path/to/fat.jar
```

The library starts a fresh JVM Remote server on first import and shuts it
down when the Python process exits. GraalPy startup takes 20–30 s.

### Connect mode (persistent / faster iteration)

If you keep a long-running Remote server running in a terminal
(e.g. `make remote-shade` in the main repo), the proxy can connect to it
instantly instead of spawning a new JVM for every test run:

```bash
# Start the server once (keep the terminal open):
make remote-shade        # fat JAR, port 8270

# Point the proxy at the existing server:
export OPERATON_REMOTE=http://127.0.0.1:8270
```

Or pass the URI directly as a library argument:

```robot
*** Settings ***
Library    Operaton    remote=http://127.0.0.1:8270
```

In connect mode the proxy never spawns or terminates a JVM process. The
process engine lifecycle is still managed per-test via `Setup Process Engine`
/ `Teardown Process Engine`.

## Usage

```robot
*** Settings ***
Library    Operaton

*** Test Cases ***
Deploy And Run
    [Setup]       Setup Process Engine
    [Teardown]    Teardown Process Engine
    Deploy Resources    ${CURDIR}${/}process.bpmn
    ${instance}=    Start Instance    my-process
    Should Have Task    ${instance}    user-task
```

## RobotCode / VS Code Integration

See the main repository's README for the `robot.toml` configuration used by
RobotCode and the VS Code extension. In the current setup, editor metadata and
test execution both go through this proxy path. The generated
`docs/Operaton.libspec` file is a published artifact, not part of the active
editor integration for the `Operaton` library.

# robotframework-operatonlibrary

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
Library    ProcessEngine

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

## Keyword overview

The `ProcessEngine` library exposes ~44 keywords. The most common ones:

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

The full library source is [src/main/resources/org.graalvm.python.vfs/src/ProcessEngine.py](src/main/resources/org.graalvm.python.vfs/src/ProcessEngine.py).

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

# AGENTS.md

Guidance for coding agents working in this repository.

## Project identity

- **Name:** `robotframework-operaton` (Maven coordinates: `org.operaton.bpm.extension.robot:operaton-bpm-extension-robot:1.0-SNAPSHOT`)
- **Purpose:** A standalone Robot Framework library + runner for acceptance-testing Operaton BPM processes and DMN decisions, built on GraalPy. Includes a CPython proxy wheel for RobotCode/VS Code integration.
- **Language mix:** Java 17 source/target (JDK 21 runtime), Python via GraalPy 25.0.3, Robot Framework 7.1.1, CPython proxy package.
- **Status:** Single-module, no parent pom, no monorepo dependency.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ RobotCode (VS Code)  or  CPython robot CLI                  │
│   → uses Operaton.libspec for keyword discovery (LSP)       │
│   → imports python/src/Operaton/ proxy for execution        │
└──────────┬──────────────────────────────────────────────────┘
           │ XML-RPC (Robot Framework Remote protocol)
           ▼
┌────────────────────────┐
│ RobotRemote.java       │  GraalPy Context + robotremoteserver
│ (--remote mode)        │  Hosts Operaton library over XML-RPC
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│ Robot.java (main)      │  GraalPy Context bootstrap
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│ Robot Framework        │  bundled into GraalPy VFS via
│ (run_cli / run)        │  graalpy-maven-plugin
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│ Operaton.py            │  @library keyword class
│ (44 keywords)          │  uses java.type(...) to call
└──────────┬─────────────┘  Operaton's Java API directly
           ▼
┌────────────────────────┐
│ Operaton process engine│  standalone in-memory (H2)
└────────────────────────┘
```

Tests are driven by JUnit 5: each `*Test.java` calls `RobotCliTest.runRobot(...)` which evaluates `robot.run.run(...)` inside a fresh GraalPy `Context` with `python.IsolateNativeModules=true` (avoids `pyexpat` issues across contexts). Output, log and report XML are suppressed in tests for speed and isolation.

## Layout

| Path | Role |
|---|---|
| [pom.xml](pom.xml) | Single-module Maven build; flattened properties; `native` profile. |
| [src/main/java/org/operaton/bpm/extension/robot/Robot.java](src/main/java/org/operaton/bpm/extension/robot/Robot.java) | CLI entry point (forwards args to `robot.run.run_cli`). Dispatches `--watch` and `--remote`. |
| [src/main/java/org/operaton/bpm/extension/robot/RobotRemote.java](src/main/java/org/operaton/bpm/extension/robot/RobotRemote.java) | Remote server mode: hosts Operaton library over XML-RPC for CPython/RobotCode. |
| [src/main/java/org/operaton/bpm/extension/robot/RobotWatch.java](src/main/java/org/operaton/bpm/extension/robot/RobotWatch.java) | Watch mode (`--watch`): keeps one GraalPy context alive; re-runs Robot on file changes (~1 s). Recreates context on `.py` changes (~2–3 s). |
| [src/main/java/org/operaton/bpm/extension/robot/Libdoc.java](src/main/java/org/operaton/bpm/extension/robot/Libdoc.java) | Generates keyword docs (HTML) and machine-readable `.libspec` for RobotCode LSP. |
| [src/main/resources/org.graalvm.python.vfs/src/Operaton.py](src/main/resources/org.graalvm.python.vfs/src/Operaton.py) | The keyword library. **Add new keywords here.** |
| [src/test/java/org/operaton/bpm/extension/robot/RobotCliTest.java](src/test/java/org/operaton/bpm/extension/robot/RobotCliTest.java) | Shared `runRobot(outputDir, suitePath)` helper + smoke tests. |
| `src/test/java/.../*Test.java` | One JUnit class per feature; each invokes a same-named `.robot` suite. |
| [src/test/resources/example/](src/test/resources/example/) | Robot suites + BPMN + DMN fixtures. |
| [python/](python/) | CPython proxy wheel (`robotframework-operaton`). Auto-spawns JVM Remote server, or connects to a pre-existing one via `OPERATON_REMOTE`. |
| [robot.toml](robot.toml) | RobotCode configuration for VS Code keyword discovery and test execution. |
| [devenv.nix](devenv.nix) | JDK 21, Maven, formatters. |
| [Makefile](Makefile) | Standard targets — see table below. |
| `tmp/` | **Reference checkout — do not modify.** Originally the source the library was ported from. |

## Development setup

The project uses [devenv.sh](https://devenv.sh/) to manage the JDK, Maven, and
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

## Build and test — always via devenv

Use `devenv shell --no-eval-cache -- <cmd>` for one-shot invocations. Inside an interactive `devenv shell` you can run the commands directly.

```sh
devenv shell --no-eval-cache -- mvn -q -DskipTests package   # thin JAR (dev)
devenv shell --no-eval-cache -- make dist-fat                # standard fat JAR
devenv shell --no-eval-cache -- make dist-vasara             # Vasara fat JAR
devenv shell --no-eval-cache -- mvn test                     # run all JUnit + Robot suites
devenv shell --no-eval-cache -- make dist-native             # native binary (slow)
devenv shell --no-eval-cache -- make format                  # treefmt (apply)
devenv shell --no-eval-cache -- make format-check            # treefmt --ci (verify)
devenv shell --no-eval-cache -- make mypy                    # mypy
devenv shell --no-eval-cache -- make dist-libspec            # generate Operaton.libspec
devenv shell --no-eval-cache -- make remote                  # start Remote server on :8270
devenv shell --no-eval-cache -- make dist-wheel              # build CPython proxy wheel
```

The first build downloads Robot Framework 7.1.1 into the GraalPy VFS via `graalpy-maven-plugin`; expect several minutes on a cold cache.

### Running a single suite

```sh
# Via Maven classpath runner:
devenv shell --no-eval-cache -- make robot SUITE=src/test/resources/example/Example.robot

# Via fat JAR (faster after first dist-fat):
devenv shell --no-eval-cache -- make run SUITE=src/test/resources/example/Example.robot
```

### Logging

To see full Operaton engine output during a dev run, pass `--loglevel DEBUG`:

```sh
# Via Maven runner
devenv shell --no-eval-cache -- make robot SUITE=src/test/resources/example/Example.robot -- --loglevel DEBUG

# Via fat JAR
devenv shell --no-eval-cache -- make run SUITE="--loglevel DEBUG src/test/resources/example/Example.robot"
```

### Makefile target reference

| Target | Description |
|---|---|
| `build` | Thin JAR: `mvn package -DskipTests` (dev/test classpath only) |
| `dist-fat` | **Standard fat JAR** (default deliverable): `-Pshade package -DskipTests` |
| `dist-vasara` | Vasara fat JAR (includes `fi.jyu.vasara.*`): `-Pshade-vasara package -DskipTests` |
| `dist-native` | Native binary (GraalVM native-image; slow): `-Pnative package` |
| `dist-wheel` | CPython proxy wheel under `python/dist/` |
| `dist-docs` | Generate `docs/Operaton.html` keyword reference |
| `dist-libspec` | Generate `docs/Operaton.libspec` for RobotCode LSP |
| `clean` | `mvn clean` |
| `test` | All JUnit + Robot suites (Nix-aware: uses `-Pnix` in devenv) |
| `check` | `mvn verify` (test + integration checks) |
| `mypy` | Run `mypy` on Python sources |
| `run` | Run a suite via fat JAR (`SUITE=path/to/Suite.robot`) |
| `run-vasara` | Run a suite via Vasara JAR |
| `run-native` | Run a suite via native binary |
| `robot` | Run a suite via Maven classpath runner (no pre-built JAR needed) |
| `watch` | Fat JAR in-process watcher, re-run on any change (~1 s) — fastest loop |
| `watch-vasara` | Vasara JAR in-process watcher |
| `watch-dev` | Maven runner watcher, rebuilds VFS on `.py` changes |
| `watch-native` | Native binary watcher (`.py` changes require `dist-native` manually) |
| `remote` | Long-running Remote server on `:8270` via fat JAR |
| `remote-vasara` | Long-running Remote server via Vasara JAR |
| `remote-dev` | Long-running Remote server via Maven classpath |
| `format` | Format sources with `treefmt` |
| `format-check` | Verify formatting with `treefmt --ci` |
| `install-proxy` | `pip install -e python/` (editable install) |

## Conventions

### Adding a new keyword

1. Add a `@keyword`-decorated method to `Operaton` in `src/main/resources/org.graalvm.python.vfs/src/Operaton.py`. Decorate with `@except_interop_exception` so Java exceptions become readable Robot failures (including a truncated Java stack trace).
2. Use `java.type("fully.qualified.JavaClass")` to access Operaton APIs. Resolve singletons at module level when they are stable.
3. Argument names map to Robot's snake-case → space form (e.g. `start_instance` → `Start Instance`).

### Adding a new feature suite

1. Create `src/test/resources/example/MyFeature.robot` and any BPMN/DMN fixtures it needs alongside.
2. Create `src/test/java/org/operaton/bpm/extension/robot/MyFeatureTest.java` mirroring the existing pattern: a `@TempDir` output dir, call `RobotCliTest.runRobot(outputDir.toString(), suitePath)`, assert exit code `0`.
3. Suites paths in Java are built with `Path.of("src", "test", "resources", "example", "MyFeature.robot").toAbsolutePath()`.

### Robot test style

- Always `[Setup] Setup Process Engine` and `[Teardown] Teardown Process Engine` per test case (engine is shared `GLOBAL` scope; teardown closes and nulls it).
- Use `${CURDIR}${/}fixture.bpmn` for file references — `${CURDIR}` resolves to the suite's directory.

### Keyword return types (Remote-safety)

- Keywords must return **Python-native types only** (str, int, float, bool, list, dict, None) so they serialize cleanly over Robot Framework's Remote protocol (XML-RPC).
- Convert Java collections/objects to Python equivalents before returning.
- The `create_*_variable()` keywords intentionally return Java boxed types that GraalPy auto-boxes to Python int/float/bool for serialization.

### Java style

- Java 17 features only. Format with `make format` (uses `treefmt`).
- No new transitive dependencies without checking `dependencyManagement` first.

## Versions

| Component | Version |
|---|---|
| GraalPy | 25.0.3 |
| Operaton BPM | 2.1.0 |
| Spring Boot (BOM only) | 3.3.3 |
| Robot Framework | 7.1.1 (bundled into VFS at build time) |
| JUnit Jupiter | 5.10.2 |
| AssertJ | 3.25.3 |
| Java source/target | 17 |
| Runtime JDK (devenv) | 21 |

For instructions on upgrading any of the above, see [UPGRADE.md](UPGRADE.md).

## Things to avoid

- Do **not** add a `<parent>` to `pom.xml` — this project is intentionally standalone.
- Do **not** touch anything under `tmp/`; it is a reference checkout the user keeps temporarily.
- Do **not** restore the deleted top-level `lib/` or `example/` directories — those locations are replaced by the standard Maven paths under `src/`.
- Do **not** use `run_cli()` in test code (it calls `sys.exit()`); use `run(...)` like `RobotCliTest` does.
- Do **not** generate Robot XML output/log/report during JUnit runs — `pyexpat` interactions across GraalPy contexts are fragile. Pass `output="NONE", log="NONE", report="NONE"`.
- Do **not** return raw Java objects from keywords — always convert to Python-native types for Remote protocol compatibility.

## Quick verification after changes

```sh
devenv shell --no-eval-cache -- mvn -q test
```

All test classes should pass (count grows as features are added; run `mvn test` and check for `BUILD SUCCESS`).

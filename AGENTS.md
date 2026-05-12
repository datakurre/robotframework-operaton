# AGENTS.md

Guidance for coding agents working in this repository.

## Project identity

- **Name:** `operaton-bpm-extension-robot` (Maven coordinates: `org.operaton.bpm.extension.robot:operaton-bpm-extension-robot:1.0-SNAPSHOT`)
- **Purpose:** A standalone Robot Framework library + runner for acceptance-testing Operaton BPM processes and DMN decisions, built on GraalPy.
- **Language mix:** Java 17 source/target (JDK 21 runtime), Python via GraalPy 25.0.2, Robot Framework 7.1.1.
- **Status:** Single-module, no parent pom, no monorepo dependency.

## Architecture

```
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
| [src/main/java/org/operaton/bpm/extension/robot/Robot.java](src/main/java/org/operaton/bpm/extension/robot/Robot.java) | CLI entry point (forwards args to `robot.run.run_cli`). |
| [src/main/resources/org.graalvm.python.vfs/src/Operaton.py](src/main/resources/org.graalvm.python.vfs/src/Operaton.py) | The keyword library. **Add new keywords here.** |
| [src/test/java/org/operaton/bpm/extension/robot/RobotCliTest.java](src/test/java/org/operaton/bpm/extension/robot/RobotCliTest.java) | Shared `runRobot(outputDir, suitePath)` helper + smoke tests. |
| `src/test/java/.../*Test.java` | One JUnit class per feature; each invokes a same-named `.robot` suite. |
| [src/test/resources/example/](src/test/resources/example/) | Robot suites + BPMN + DMN fixtures. |
| [devenv.nix](devenv.nix) | JDK 21, Maven, formatters. |
| [Makefile](Makefile) | Standard targets: `build`, `test`, `check`, `format`, `clean`, `native`, `robot`. |
| `tmp/` | **Reference checkout — do not modify.** Originally the source the library was ported from. |

## Build and test — always via devenv

Use `devenv shell --no-eval-cache -- <cmd>` for one-shot invocations. Inside an interactive `devenv shell` you can run the commands directly.

```sh
devenv shell --no-eval-cache -- mvn -q -DskipTests package   # build
devenv shell --no-eval-cache -- mvn test                     # run all JUnit + Robot suites
devenv shell --no-eval-cache -- mvn -Pnative package         # native image (slow)
devenv shell --no-eval-cache -- make format                  # google-java-format
```

The first build downloads Robot Framework 7.1.1 into the GraalPy VFS via `graalpy-maven-plugin`; expect several minutes on a cold cache.

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

### Java style

- Java 17 features only. Format with `make format` (uses `google-java-format`).
- No new transitive dependencies without checking `dependencyManagement` first.

## Versions

| Component | Version |
|---|---|
| GraalPy | 25.0.2 |
| Operaton BPM | 1.0.3 |
| Spring Boot (BOM only) | 3.3.3 |
| Robot Framework | 7.1.1 (bundled into VFS at build time) |
| JUnit Jupiter | 5.10.2 |
| AssertJ | 3.25.3 |
| Java source/target | 17 |
| Runtime JDK (devenv) | 21 |

## Things to avoid

- Do **not** add a `<parent>` to `pom.xml` — this project is intentionally standalone.
- Do **not** touch anything under `tmp/`; it is a reference checkout the user keeps temporarily.
- Do **not** restore the deleted top-level `lib/` or `example/` directories — those locations are replaced by the standard Maven paths under `src/`.
- Do **not** use `run_cli()` in test code (it calls `sys.exit()`); use `run(...)` like `RobotCliTest` does.
- Do **not** generate Robot XML output/log/report during JUnit runs — `pyexpat` interactions across GraalPy contexts are fragile. Pass `output="NONE", log="NONE", report="NONE"`.

## Quick verification after changes

```sh
devenv shell --no-eval-cache -- mvn -q test
```

All 16 test classes should pass.

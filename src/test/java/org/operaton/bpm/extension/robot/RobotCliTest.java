package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.python.embedding.GraalPyResources;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Tests for the Robot Framework CLI invocation via GraalPy.
 *
 * <p>Verifies that the Robot runner can invoke Robot Framework with the example suite and that the
 * exit code is propagated correctly. Uses the programmatic {@code robot.api.run} function (instead
 * of {@code run_cli}) to avoid {@code sys.exit()} calls and XML output generation issues on
 * GraalPy.
 */
class RobotCliTest {

  @Test
  void robotFrameworkExampleSuitePassesAllTests(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "Example.robot").toAbsolutePath().toString();

    int exitCode = runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode).as("Robot Framework exit code (0 = all tests passed)").isEqualTo(0);
  }

  @Test
  void robotFrameworkReportsFailureForMissingSuite(@TempDir Path outputDir) {
    int exitCode = runRobot(outputDir.toString(), "/nonexistent/suite.robot");
    assertThat(exitCode).as("Robot Framework exit code for missing suite").isNotEqualTo(0);
  }

  /**
   * Runs Robot Framework via GraalPy with the given arguments and returns the exit code.
   *
   * <p>Uses {@code robot.run.run()} which returns the exit code directly without calling {@code
   * sys.exit()}, and passes {@code output=NONE} to skip XML output generation (which requires the
   * {@code pyexpat} native module that can cause issues with multiple GraalPy contexts).
   *
   * @param outputDir directory for Robot Framework output files
   * @param suitePath path to the Robot Framework suite to run
   * @return the Robot Framework exit code (0 = success)
   */
  static int runRobot(String outputDir, String suitePath) {
    try (Context context =
        GraalPyResources.contextBuilder()
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .option("python.IsolateNativeModules", "true")
            .build()) {
      context.getBindings("python").putMember("cwd", System.getProperty("user.dir"));
      context.getBindings("python").putMember("suite_path", suitePath);
      context.getBindings("python").putMember("output_dir", outputDir);
      Source source =
          Source.newBuilder(
                  "python",
                  """
                  import os
                  import sys
                  from robot.run import run
                  sys.path.insert(0, cwd)
                  sys.path.insert(1, os.path.join(cwd, "lib"))
                  rc = run(suite_path, outputdir=output_dir, output="NONE", log="NONE", report="NONE")
                  rc
                  """,
                  "<test>")
              .build();
      Value result = context.eval(source);
      return result.asInt();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}

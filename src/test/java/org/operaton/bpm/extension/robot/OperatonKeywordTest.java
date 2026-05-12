package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for the Operaton Robot Framework keyword library.
 *
 * <p>Verifies that the Operaton library can set up and tear down an Operaton engine, deploy
 * BPMN resources, start process instances, and assert task state — all via Robot Framework keywords
 * executed through GraalPy.
 */
class OperatonKeywordTest {

  @Test
  void operatonKeywordsWorkEndToEnd(@TempDir Path outputDir) throws Exception {
    // The Example.robot suite exercises: Setup Process Engine, Deploy Resources,
    // Start Instance, Should Have Task, Teardown Process Engine
    String suitePath =
        Path.of("src", "test", "resources", "example", "Example.robot").toAbsolutePath().toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode).as("Robot Framework exit code (0 = all keywords passed)").isEqualTo(0);
  }

  @Test
  void operatonKeywordsWithCompleteTask(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "CompleteTask.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode).as("Robot Framework exit code (0 = all keywords passed)").isEqualTo(0);
  }
}

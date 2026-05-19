package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for task name resolution: keywords that accept a task definition key also accept
 * the human-readable task name when exactly one task with that name exists on the process instance.
 */
class TaskNameResolutionTest {

  @Test
  void taskNameResolutionKeywordsWork(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "TaskNameResolution.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all task name resolution tests passed)")
        .isEqualTo(0);
  }
}

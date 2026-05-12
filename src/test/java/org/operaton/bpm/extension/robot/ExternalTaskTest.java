package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for external task keywords: Fetch And Lock and Complete External Task. Verifies
 * that external service tasks can be fetched, locked, and completed via Robot Framework keywords.
 */
class ExternalTaskTest {

  @Test
  void externalTaskKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "ExternalTask.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all external task tests passed)")
        .isEqualTo(0);
  }
}

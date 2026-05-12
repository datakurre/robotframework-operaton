package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for negative DMN scenarios: missing decisions, missing inputs, assertion
 * failures with multiple results, and empty result handling.
 */
class DmnNegativeTest {

  @Test
  void negativeDmnScenariosHandledCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "DmnNegative.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all negative DMN tests passed)")
        .isEqualTo(0);
  }
}

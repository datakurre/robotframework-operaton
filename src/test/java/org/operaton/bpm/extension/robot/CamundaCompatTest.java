package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/** Integration test for Camunda compatibility JavaScript shims loaded from script env resources. */
class CamundaCompatTest {

  @Test
  void camundaCompatibilityScriptIsAvailableToScriptTasks(@TempDir Path outputDir)
      throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "CamundaCompat.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = Camunda compatibility script fixture passed)")
        .isEqualTo(0);
  }
}

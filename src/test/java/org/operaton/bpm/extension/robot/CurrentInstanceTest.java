package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for the current-instance state management keywords: Start Instance stores the
 * current instance ID and business key; subsequent keywords (Should Have Task, Complete Task,
 * Should Be Ended, etc.) default to that instance without needing an explicit process_instance_id
 * argument.
 */
class CurrentInstanceTest {

  @Test
  void currentInstanceStateKeywordsWork(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "CurrentInstance.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all current-instance tests passed)")
        .isEqualTo(0);
  }
}

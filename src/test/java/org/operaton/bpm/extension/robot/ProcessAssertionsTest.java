package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for process instance assertion keywords: Should Be Active, Should Be Ended,
 * Should Be Suspended, Suspend Instance, Activate Instance, and Should Have N Active Tasks.
 */
class ProcessAssertionsTest {

  @Test
  void processAssertionKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "ProcessAssertions.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all process assertion tests passed)")
        .isEqualTo(0);
  }
}

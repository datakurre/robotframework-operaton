package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for error event keywords: Throw Bpmn Error and Should Have Incident. Verifies
 * that BPMN errors thrown on external tasks correctly trigger error boundary events.
 */
class ErrorKeywordsTest {

  @Test
  void errorKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "ErrorKeywords.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all error keyword tests passed)")
        .isEqualTo(0);
  }
}

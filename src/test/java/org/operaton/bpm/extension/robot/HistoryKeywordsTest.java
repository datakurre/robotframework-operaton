package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for history query keywords: Get Completed Instances and Get Historic Variables.
 * Verifies that completed process instances and their variables can be queried through the history
 * service via Robot Framework keywords.
 */
class HistoryKeywordsTest {

  @Test
  void historyKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "HistoryKeywords.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all history keyword tests passed)")
        .isEqualTo(0);
  }
}

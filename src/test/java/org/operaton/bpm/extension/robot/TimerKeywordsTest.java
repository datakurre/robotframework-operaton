package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for timer manipulation keywords: Set Clock, Advance Clock, Reset Clock, and
 * Execute Timer Jobs. Verifies that timer events can be triggered programmatically.
 */
class TimerKeywordsTest {

  @Test
  void timerKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "TimerKeywords.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all timer keyword tests passed)")
        .isEqualTo(0);
  }
}

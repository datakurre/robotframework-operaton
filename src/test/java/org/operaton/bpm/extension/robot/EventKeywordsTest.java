package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for event keywords: Signal Event, Throw Signal, Correlate Message, and Send
 * Message. Verifies that signal and message events correctly advance process instances.
 */
class EventKeywordsTest {

  @Test
  void eventKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "EventKeywords.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all event keyword tests passed)")
        .isEqualTo(0);
  }
}

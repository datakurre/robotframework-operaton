package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/** Integration test for file variable keywords in external tasks: Create File Variable. */
class FileValueTest {

  @Test
  void fileValueKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "file-value.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all file value tests passed)")
        .isEqualTo(0);
  }
}

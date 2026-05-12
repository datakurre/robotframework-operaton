package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for type coercion keywords: verifies that string-to-integer, string-to-double,
 * string-to-boolean, and string-to-date conversions work correctly when used as DMN decision inputs
 * and process variables.
 */
class TypeCoercionTest {

  @Test
  void typeCoercionKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "TypeCoercion.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all type coercion tests passed)")
        .isEqualTo(0);
  }
}

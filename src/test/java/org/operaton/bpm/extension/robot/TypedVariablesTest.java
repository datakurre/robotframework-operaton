package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for typed variable keywords: Create Integer Variable, Create Double Variable,
 * Create Boolean Variable, and their use in DMN decision evaluation with integer inputs.
 */
class TypedVariablesTest {

  @Test
  void typedVariableKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "TypedVariables.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all typed variable tests passed)")
        .isEqualTo(0);
  }
}

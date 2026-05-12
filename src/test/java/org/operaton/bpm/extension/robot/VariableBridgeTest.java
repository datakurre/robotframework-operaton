package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Tests for the variable bridge between Robot Framework and Operaton process variables.
 *
 * <p>Verifies that process variables can be set and read back through the Operaton Robot
 * Framework keyword library, ensuring correct round-trip serialization between Python and Java.
 */
class VariableBridgeTest {

  @Test
  void processVariablesRoundTripThroughRobot(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "VariableBridge.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = variable round-trip passed)")
        .isEqualTo(0);
  }
}

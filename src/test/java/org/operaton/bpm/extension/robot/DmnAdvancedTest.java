package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for advanced DMN features: multi-output decisions, collect entries, decision
 * definition assertions, and DRG (Decision Requirements Graph) evaluation.
 */
class DmnAdvancedTest {

  @Test
  void advancedDmnFeaturesWorkEndToEnd(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "DmnAdvanced.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all advanced DMN tests passed)")
        .isEqualTo(0);
  }
}

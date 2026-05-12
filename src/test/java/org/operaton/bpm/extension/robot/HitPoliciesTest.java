package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for DMN hit policies: FIRST, UNIQUE, ANY, COLLECT, and RULE ORDER. Verifies that
 * each hit policy produces the expected decision results.
 */
class HitPoliciesTest {

  @Test
  void dmnHitPoliciesWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "HitPolicies.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all hit policy tests passed)")
        .isEqualTo(0);
  }
}

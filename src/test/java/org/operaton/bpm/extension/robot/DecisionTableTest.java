package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for the DMN-related Robot Framework keywords in the ProcessEngine library.
 *
 * <p>Verifies that the ProcessEngine library can deploy DMN decision definitions, evaluate decision
 * tables with input variables, and assert decision results — all via Robot Framework keywords
 * executed through GraalPy.
 */
class DecisionTableTest {

  @Test
  void dmnDecisionTableKeywordsWorkEndToEnd(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "DecisionTable.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode).as("Robot Framework exit code (0 = all DMN keywords passed)").isEqualTo(0);
  }
}

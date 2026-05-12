package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for deploying BPMN + DMN together with a Business Rule Task that evaluates a DMN
 * decision during process execution.
 */
class BusinessRuleTaskTest {

  @Test
  void businessRuleTaskEvaluatesDmnDecision(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "BusinessRuleTask.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all business rule task tests passed)")
        .isEqualTo(0);
  }
}

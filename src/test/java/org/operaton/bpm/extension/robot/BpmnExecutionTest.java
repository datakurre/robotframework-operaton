package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for BPMN execution keywords: Get Activity History, Get Process Definition Id,
 * Get Process Model Xml, and Log Bpmn Execution.
 */
class BpmnExecutionTest {

  @Test
  void bpmnExecutionKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "BpmnExecution.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all BPMN execution keyword tests passed)")
        .isEqualTo(0);
  }
}

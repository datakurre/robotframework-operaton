package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for the process test coverage keyword: Log Bpmn Test Coverage.
 *
 * <p>Verifies that coverage is collected by the operaton-process-test-coverage library wired into
 * the engine and that the keyword logs a coverage table (and an SVG when a definition is given)
 * after full, partial, and table-only runs.
 */
class BpmnTestCoverageTest {

  @Test
  void bpmnTestCoverageKeywordWorksCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "BpmnTestCoverage.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all BPMN test coverage keyword tests passed)")
        .isEqualTo(0);
  }
}

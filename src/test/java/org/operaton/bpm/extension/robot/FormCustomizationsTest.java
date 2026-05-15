package org.operaton.bpm.extension.robot;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * Integration test for the form customization keywords: Submit Task Form and Get Task Form
 * Variables.
 *
 * <p>Verifies that the keywords work correctly with the standard engine configuration (Spin always
 * active). Vasara-specific form type behaviour (json, flexible date, number) is additionally
 * exercised when running from the vasara fat JAR.
 */
class FormCustomizationsTest {

  @Test
  void formCustomizationKeywordsWorkCorrectly(@TempDir Path outputDir) throws Exception {
    String suitePath =
        Path.of("src", "test", "resources", "example", "FormCustomizations.robot")
            .toAbsolutePath()
            .toString();

    int exitCode = RobotCliTest.runRobot(outputDir.toString(), suitePath);
    assertThat(exitCode)
        .as("Robot Framework exit code (0 = all form customization keyword tests passed)")
        .isEqualTo(0);
  }
}

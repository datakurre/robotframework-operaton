package org.operaton.bpm.extension.robot;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Renders a BPMN diagram to SVG by invoking the bundled {@code bpmn-render.js} script
 * via a {@code node} subprocess.
 *
 * <p>The script is extracted from the classpath to a temporary file on first use and
 * cached for the lifetime of the JVM.
 *
 * <p>Requires Node.js 18+ on PATH at runtime. If {@code node} is not available, callers
 * should degrade gracefully (see {@link #isNodeAvailable()}).
 */
public class BpmnRenderer {

  private static final String SCRIPT_RESOURCE = "bpmn-render.js";

  private static volatile Path cachedScript;

  private BpmnRenderer() {}

  /**
   * Renders a BPMN diagram to SVG.
   *
   * @param jsonInput JSON string: {@code {"bpmn": "<xml>", "activities": [...]}}
   * @return SVG string
   * @throws Exception if node is not available, the script fails, or I/O errors occur
   */
  public static String renderSvg(String jsonInput) throws Exception {
    Path script = ensureRenderScript();
    ProcessBuilder pb = new ProcessBuilder("node", script.toString());
    pb.redirectErrorStream(false);

    Process proc = pb.start();
    try (OutputStream stdin = proc.getOutputStream()) {
      stdin.write(jsonInput.getBytes(StandardCharsets.UTF_8));
    }

    byte[] stdoutBytes = proc.getInputStream().readAllBytes();
    byte[] stderrBytes = proc.getErrorStream().readAllBytes();
    int exitCode = proc.waitFor();

    String stderr = new String(stderrBytes, StandardCharsets.UTF_8).strip();
    if (exitCode != 0) {
      throw new RuntimeException(
          "bpmn-render failed (exit " + exitCode + ")" + (stderr.isEmpty() ? "" : ": " + stderr));
    }
    return new String(stdoutBytes, StandardCharsets.UTF_8);
  }

  /**
   * Returns {@code true} if {@code node} is executable on the current PATH.
   *
   * <p>The check is done by running {@code node --version}; result is not cached so
   * that callers can detect changes between calls (e.g., during testing).
   */
  public static boolean isNodeAvailable() {
    try {
      int exit = new ProcessBuilder("node", "--version")
          .redirectErrorStream(true)
          .start()
          .waitFor();
      return exit == 0;
    } catch (Exception e) {
      return false;
    }
  }

  private static Path ensureRenderScript() throws IOException {
    if (cachedScript != null && Files.exists(cachedScript)) {
      return cachedScript;
    }
    synchronized (BpmnRenderer.class) {
      if (cachedScript != null && Files.exists(cachedScript)) {
        return cachedScript;
      }
      try (InputStream is =
          BpmnRenderer.class.getClassLoader().getResourceAsStream(SCRIPT_RESOURCE)) {
        if (is == null) {
          throw new IOException(
              SCRIPT_RESOURCE + " not found in classpath — rebuild with 'mvn package'");
        }
        Path tmp = Files.createTempFile("bpmn-render-", ".cjs");
        tmp.toFile().deleteOnExit();
        Files.write(tmp, is.readAllBytes());
        cachedScript = tmp;
        return tmp;
      }
    }
  }
}

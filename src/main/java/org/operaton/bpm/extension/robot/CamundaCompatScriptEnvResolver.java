package org.operaton.bpm.extension.robot;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;
import java.util.logging.Logger;
import org.operaton.bpm.engine.impl.scripting.env.ScriptEnvResolver;

/**
 * Resolves Camunda compatibility environment scripts for JavaScript.
 *
 * <p>This resolver provides JavaScript environment scripts that shim Camunda class references to
 * their Operaton equivalents.
 */
public class CamundaCompatScriptEnvResolver implements ScriptEnvResolver {

  private static final Logger LOGGER =
      Logger.getLogger(CamundaCompatScriptEnvResolver.class.getName());

  private static final String SCRIPT_PATH = "script/env/javascript/camunda-compat.js";

  private static final Set<String> SUPPORTED_LANGUAGES =
      Set.of("javascript", "ecmascript", "graal.js", "js");

  private String cachedScript;

  @Override
  public String[] resolve(String language) {
    if (language == null) {
      return new String[0];
    }

    String normalizedLanguage = language.toLowerCase(Locale.ROOT);
    if (!SUPPORTED_LANGUAGES.contains(normalizedLanguage)) {
      return new String[0];
    }

    String script = loadScript();
    if (script == null) {
      LOGGER.warning("Failed to load Camunda compatibility script from: " + SCRIPT_PATH);
      return new String[0];
    }

    return new String[] {script};
  }

  private synchronized String loadScript() {
    if (cachedScript != null) {
      return cachedScript;
    }

    try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(SCRIPT_PATH)) {
      if (inputStream == null) {
        LOGGER.severe("Camunda compatibility script not found: " + SCRIPT_PATH);
        return null;
      }
      cachedScript = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
      LOGGER.fine("Loaded Camunda compatibility script (" + cachedScript.length() + " bytes)");
      return cachedScript;
    } catch (IOException e) {
      LOGGER.severe("Error loading Camunda compatibility script: " + e.getMessage());
      return null;
    }
  }
}

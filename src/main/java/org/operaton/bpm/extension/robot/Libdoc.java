package org.operaton.bpm.extension.robot;

import java.io.IOException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.python.embedding.GraalPyResources;

/**
 * Generates Robot Framework keyword documentation for Operaton via {@code robot.libdoc}.
 *
 * <p>Usage: {@code Libdoc [output-path]} — defaults to {@code docs/Operaton.html}.
 *
 * <p>The output format is inferred from the file extension: {@code .html} produces human-readable
 * docs, {@code .libspec} or {@code .xml} produces the standard machine-readable XML library spec,
 * and {@code .json} produces a JSON spec.
 */
public class Libdoc {
  private static final String PYTHON = "python";

  public static void main(String[] args) {
    String output = args.length > 0 ? args[0] : "docs/Operaton.html";
    try (Context context =
        GraalPyResources.contextBuilder()
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .build()) {
      context.getBindings(PYTHON).putMember("output", output);
      Source source;
      try {
        source =
            Source.newBuilder(
                    PYTHON,
                    """
                    import os
                    from robot.libdoc import libdoc
                    # Determine format from file extension
                    ext = os.path.splitext(output)[1].lower()
                    if ext in ('.libspec', '.xml'):
                        libdoc("Operaton", output, format="LIBSPEC")
                    elif ext == '.json':
                        libdoc("Operaton", output, format="JSON")
                    else:
                        libdoc("Operaton", output)
                    """,
                    "<internal>")
                .build();
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
      context.eval(source);
    } catch (PolyglotException e) {
      if (e.isExit()) {
        System.exit(e.getExitStatus());
      } else {
        throw e;
      }
    }
  }
}

package org.operaton.bpm.extension.robot;

import java.io.IOException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.python.embedding.GraalPyResources;

/** Generates Robot Framework keyword documentation for Operaton via {@code robot.libdoc}. */
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
                    from robot.libdoc import libdoc
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

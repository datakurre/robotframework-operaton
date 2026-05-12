package org.operaton.bpm.extension.robot;

import java.io.IOException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.python.embedding.GraalPyResources;

// import org.operaton.bpm.engine.test.assertions.bpmn.BpmnAwareTests;

public class Robot {
  private static final String PYTHON = "python";

  public static void main(String[] args) {
    try (Context context =
        GraalPyResources.contextBuilder()
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .build()) {
      context.getBindings(PYTHON).putMember("cwd", System.getProperty("user.dir"));
      context.getBindings(PYTHON).putMember("args", String.join(" ", args));
      Source source;
      try {
        source =
            Source.newBuilder(
                    PYTHON,
                    """
                    import os
                    import sys
                    from robot.run import run_cli
                    sys.path.insert(0, cwd)
                    sys.path.insert(1, os.path.join(cwd, "lib"))
                    sys.argv = ["robot"] + [
                        x for x in args.split()
                        if not x.startswith("-agentlib")
                    ]
                    if "--outputdir" not in sys.argv:
                        sys.argv.insert(1, "--outputdir")
                        sys.argv.insert(2, cwd)
                    run_cli()
                    """,
                    "<internal>")
                .build();
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
      System.out.println(context.eval(source));
    } catch (PolyglotException e) {
      if (e.isExit()) {
        System.exit(e.getExitStatus());
      } else {
        throw e;
      }
    }
  }
}

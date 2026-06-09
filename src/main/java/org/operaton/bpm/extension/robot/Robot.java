package org.operaton.bpm.extension.robot;

import java.io.IOException;
import java.io.OutputStream;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.python.embedding.GraalPyResources;

// import org.operaton.bpm.engine.test.assertions.bpmn.BpmnAwareTests;

public class Robot {
  private static final String PYTHON = "python";

  public static void main(String[] args) {
    // Delegate to watch mode when --watch is the first argument
    if (args.length > 0 && "--watch".equals(args[0])) {
      RobotWatch.run(args);
      return;
    }

    // Delegate to remote server mode when --remote is the first argument
    if (args.length > 0 && "--remote".equals(args[0])) {
      RobotRemote.run(args);
      return;
    }

    boolean debugMode = isDebugMode(args);

    Context.Builder builder =
        GraalPyResources.contextBuilder()
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .option("engine.WarnInterpreterOnly", "false");
    if (!debugMode) {
      builder.logHandler(OutputStream.nullOutputStream());
    }
    try (Context context = builder.build()) {
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

  static boolean isDebugMode(String[] args) {
    for (int i = 0; i < args.length; i++) {
      String arg = args[i];
      if (arg.startsWith("--loglevel=")) {
        String level = arg.substring("--loglevel=".length()).toUpperCase();
        return level.startsWith("DEBUG") || level.startsWith("TRACE");
      }
      if ("--loglevel".equals(arg) && i + 1 < args.length) {
        String level = args[i + 1].toUpperCase();
        return level.startsWith("DEBUG") || level.startsWith("TRACE");
      }
    }
    return false;
  }
}

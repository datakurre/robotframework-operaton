package org.operaton.bpm.extension.robot;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.python.embedding.GraalPyResources;

/**
 * Persistent-context watch runner.
 *
 * <p>Keeps one GraalPy context alive across multiple Robot Framework runs, avoiding JVM restart
 * overhead on every file change. The context is recreated only when a .py source file changes.
 *
 * <p>By prepending the real on-disk VFS source directory to sys.path (when available), Operaton and
 * keyword modules are loaded from disk on each context creation — so .py edits are reflected
 * without rebuilding the fat JAR.
 *
 * <p>Usage (via Robot.main --watch):
 *
 * <pre>
 *   java -jar robot.jar --watch [suite-path] [--py-src path/to/vfs/src]
 * </pre>
 */
public class RobotWatch {

  private static final String PYTHON = "python";

  // Relative path to VFS Python sources; prepended to sys.path so on-disk edits are picked up
  // without a fat JAR rebuild when running in watch mode from the project directory.
  static final String DEFAULT_VFS_SRC = "src/main/resources/org.graalvm.python.vfs/src";

  // Extensions that require only a re-run (no context recreation)
  private static final List<String> RERUN_EXTS = Arrays.asList(".robot", ".bpmn", ".dmn");
  // Extensions that require context recreation
  private static final List<String> RELOAD_EXTS = List.of(".py");

  public static void run(String[] args) {
    String suitePath = "src/test/resources/example";
    String vfsSrcPath = null;

    // Parse args: --watch [suite-path] [--py-src <dir>]
    List<String> rest = new ArrayList<>(Arrays.asList(args));
    rest.remove("--watch");
    for (int i = 0; i < rest.size(); i++) {
      if ("--py-src".equals(rest.get(i)) && i + 1 < rest.size()) {
        vfsSrcPath = rest.get(i + 1);
        rest.remove(i + 1);
        rest.remove(i);
        i--;
      }
    }
    if (!rest.isEmpty()) {
      suitePath = rest.get(0);
    }

    // Default to on-disk VFS src if it exists (project development layout)
    if (vfsSrcPath == null) {
      Path candidate = Paths.get(DEFAULT_VFS_SRC).toAbsolutePath();
      if (Files.isDirectory(candidate)) {
        vfsSrcPath = candidate.toString();
      }
    }

    Path suite = Paths.get(suitePath).toAbsolutePath();
    String cwd = System.getProperty("user.dir");

    System.out.printf("=== Robot Watch ===%n");
    System.out.printf("Suite : %s%n", suite);
    System.out.printf("Python: %s%n", vfsSrcPath != null ? vfsSrcPath : "<VFS only>");
    System.out.printf("Ctrl+C to stop.%n");
    System.out.printf("──────────────────────────────────────────────%n");

    // Collect directories to watch
    List<Path> watchDirs = new ArrayList<>();
    watchDirs.add(Files.isDirectory(suite) ? suite : suite.getParent());

    Path vfsSrc = vfsSrcPath != null ? Paths.get(vfsSrcPath) : null;
    if (vfsSrc != null && Files.isDirectory(vfsSrc)) {
      watchDirs.add(vfsSrc);
      // Also watch keywords/ subdirectory
      Path keywords = vfsSrc.resolve("keywords");
      if (Files.isDirectory(keywords)) {
        watchDirs.add(keywords);
      }
    }

    try (WatchService watchService = FileSystems.getDefault().newWatchService()) {
      for (Path dir : watchDirs) {
        dir.register(watchService, ENTRY_MODIFY, ENTRY_CREATE);
      }

      // Create initial context and run once
      final String finalVfsSrcPath = vfsSrcPath;
      final boolean debugMode = Robot.isDebugMode(args);
      if (debugMode) {
        System.setProperty("ROBOT_LOG_LEVEL", "INFO");
      }
      Context[] ctxHolder = {createContext(cwd, finalVfsSrcPath, debugMode)};
      runSuite(ctxHolder[0], cwd, suite.toString());

      while (true) {
        WatchKey key = watchService.poll(500, TimeUnit.MILLISECONDS);
        if (key == null) continue;

        boolean needsReload = false;
        boolean needsRerun = false;
        String changedFile = null;

        for (WatchEvent<?> event : key.pollEvents()) {
          String name = event.context().toString();
          if (RELOAD_EXTS.stream().anyMatch(name::endsWith)) {
            needsReload = true;
            changedFile = name;
          } else if (RERUN_EXTS.stream().anyMatch(name::endsWith)) {
            needsRerun = true;
            changedFile = name;
          }
        }
        key.reset();

        if (!needsReload && !needsRerun) continue;

        System.out.printf("%n>>> Changed: %s%n", changedFile);

        if (needsReload) {
          System.out.println(">>> Python source changed — recreating context...");
          ctxHolder[0].close();
          ctxHolder[0] = createContext(cwd, finalVfsSrcPath, debugMode);
        }

        runSuite(ctxHolder[0], cwd, suite.toString());
      }

    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static Context createContext(String cwd, String vfsSrcPath, boolean debugMode) {
    Context.Builder builder =
        GraalPyResources.contextBuilder()
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .option("python.IsolateNativeModules", "true")
            .option("engine.WarnInterpreterOnly", "false");
    if (!debugMode) {
      builder.logHandler(OutputStream.nullOutputStream());
    }
    Context ctx = builder.build();

    ctx.getBindings(PYTHON).putMember("_watch_cwd", cwd);
    ctx.getBindings(PYTHON).putMember("_watch_vfs_src", vfsSrcPath != null ? vfsSrcPath : "");

    try {
      Source setup =
          Source.newBuilder(
                  PYTHON,
                  """
                  import os, sys
                  if _watch_vfs_src:
                      sys.path.insert(0, _watch_vfs_src)
                  sys.path.insert(0 if not _watch_vfs_src else 1, _watch_cwd)
                  sys.path.insert(1 if not _watch_vfs_src else 2, os.path.join(_watch_cwd, "lib"))
                  from robot.run import run as _robot_run
                  """,
                  "<watch-setup>")
              .build();
      ctx.eval(setup);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
    return ctx;
  }

  private static void runSuite(Context ctx, String cwd, String suitePath) {
    System.out.printf(">>> Running: %s%n", suitePath);
    long start = System.currentTimeMillis();
    try {
      ctx.getBindings(PYTHON).putMember("_watch_suite", suitePath);
      ctx.getBindings(PYTHON).putMember("_watch_outputdir", cwd);
      Source run =
          Source.newBuilder(
                  PYTHON,
                  """
                  _robot_run(
                      _watch_suite,
                      outputdir=_watch_outputdir,
                      output="NONE",
                      log="NONE",
                      report="NONE",
                  )
                  """,
                  "<watch-run>")
              .build();
      Value rc = ctx.eval(run);
      long elapsed = System.currentTimeMillis() - start;
      if (rc.asInt() == 0) {
        System.out.printf(">>> PASS  (%dms)%n", elapsed);
      } else {
        System.out.printf(">>> FAIL  (%dms)%n", elapsed);
      }
    } catch (PolyglotException | IOException e) {
      System.out.printf(">>> ERROR: %s%n", e.getMessage());
    }
    System.out.println("──────────────────────────────────────────────");
  }
}

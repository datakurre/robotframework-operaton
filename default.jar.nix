{
  fetchurl,
  jdk_headless,
  maven,
  stdenv,
  coverage-lib,
  profile ? "shade",
  classifier ? "fat",
}:
let
  # Pre-fetch Python wheels (ZIP archives) so the Nix sandbox build can
  # install them into the GraalPy virtual filesystem without network access.
  robotframeworkWheel = fetchurl {
    url = "https://files.pythonhosted.org/packages/bb/3c/a1f0971f4405c5accea879e84be91fb98956d778ff1cfc232410fc8558ae/robotframework-7.1.1-py3-none-any.whl";
    sha256 = "0y9nivnd5p4d3yddgf6086g7g8zflq7kfhizmghqryqdw05kcq84";
  };

  pythonlibcoreWheel = fetchurl {
    url = "https://files.pythonhosted.org/packages/a0/1d/3d14b45ff63b8c710bda8ad6b7c9e7e55272e38ce890a4442804fd768ca1/robotframework_pythonlibcore-4.5.0-py3-none-any.whl";
    sha256 = "1bqxfvvb9d88lp6bl3gx8m0aznsns0rfmhc0sx3lfx8fi5dhq8jc";
  };

  robotremoteserverWheel = fetchurl {
    url = "https://files.pythonhosted.org/packages/ce/77/532abf69fe4107cf0dea47c84816cb4ed65e15f376cee93690fe89b0ec78/robotremoteserver-1.1.1-py2.py3-none-any.whl";
    sha256 = "sha256-o0QFHU4r9DXglwNl1AUc2hMQA5Xgcv+Iy3QPnDYyBr8=";
  };

  # Exclude directories not needed for the Maven build.
  filteredSrc = builtins.filterSource (
    path: _type:
    let
      base = baseNameOf path;

      # Excluded by basename anywhere in the tree (safe: these names never
      # appear as meaningful subdirectory names inside src/main/resources).
      excludedAnywhere = [
        ".devenv"
        ".git"
        ".idea"
        "__pycache__"
        "node_modules"
        "target"
        "tmp"
      ];

      # Excluded only when they appear directly under the repo root.
      root = builtins.toString ./.;
      excludedAtRoot = [
        "dependency-reduced-pom.xml"
        "default.jar.nix"
        "default.nix"
        "devenv.local.nix"
        "devenv.local.yaml"
        "devenv.nix"
        "devenv.yaml"
        "docs"
        "flake.lock"
        "flake.nix"
        "log.html"
        "mvn2nix.lock"
        "output.xml"
        "report.html"
      ];
    in
    !(builtins.elem base excludedAnywhere)
    && !(builtins.elem path (map (name: "${root}/${name}") excludedAtRoot))
  ) ./.;

  # Fixed-output derivation that pre-fetches all Maven artifacts.
  # FODs are allowed network access even when sandbox = true.
  # We ONLY resolve dependencies here -- no GraalPy execution, which avoids
  # all native-library issues (libtrufflenfi.so ELF interpreter, etc.).
  # Note: The operaton-process-test-coverage library (SNAPSHOT, not on Maven Central)
  # must be pre-built and installed to ~/.m2/repository before building in development.
  # For Nix builds, we use a workaround: the mavenRepository FOD will fail to find coverage
  # artifacts, but we can pre-populate the Maven repo cache by building locally first.
  mavenRepository = stdenv.mkDerivation {
    name = "operaton-bpm-extension-robot-maven-deps";
    src = filteredSrc;
    buildInputs = [
      jdk_headless
      maven
    ];
    buildPhase = ''
      echo "=== Nix build starting in $PWD ==="
      echo "mavenRepository will be at: $out"

      # First, build and install the coverage library from the Nix input
      # so its SNAPSHOT artifacts are available in the local Maven repo.
      if [ -d "${coverage-lib}" ]; then
        echo ""
        echo "=== Preparing coverage library from Nix input at ${coverage-lib} ==="
        # Copy to a writable location (Nix inputs are read-only)
        COVERAGE_BUILD=$(mktemp -d)
        cp -r "${coverage-lib}" "$COVERAGE_BUILD/coverage"
        chmod -R +w "$COVERAGE_BUILD/coverage"
        
        echo "=== Building coverage library ==="
        # project.build.outputTimestamp pins every ZIP entry timestamp and the
        # JAR manifest build time to a fixed value (maven-archiver honors this
        # property, including via -D). Without it the locally built coverage
        # SNAPSHOT JARs embed the wall-clock build time, so their bytes -- and
        # therefore the recursive output hash -- differ between machines/builds.
        # dokka.skip disables the dokka-maven-plugin:javadocJar execution that
        # builds the *-javadoc.jar artifacts. Those jars are not needed by the
        # consuming build and the Dokka archiver does NOT honor
        # project.build.outputTimestamp, so their ZIP entry timestamps would
        # otherwise reintroduce nondeterminism. (maven.javadoc.skip has no
        # effect here because javadoc is produced by Dokka, not maven-javadoc.)
        (cd "$COVERAGE_BUILD/coverage" && \
          mvn -q -pl bom,extension/core,extension/engine-platform-7 -am install \
            -Dmaven.test.skip=true \
            -Ddokka.skip=true \
            -Dproject.build.outputTimestamp=2024-01-01T00:00:00Z \
            -Dmaven.repo.local=$out \
            -B)
        echo "=== Coverage library build completed ==="
        echo "Checking what was installed..."
        find $out -type f -name "*.jar" | grep -i coverage | head -10
        rm -rf "$COVERAGE_BUILD"
      else
        echo "ERROR: coverage library input not available at ${coverage-lib}"
        exit 1
      fi

      echo ""
      # Then, run the full Maven build (with -Pnix skipping graalpy-maven-plugin)
      # so every artifact needed for an offline build is downloaded to $out.
      # The build output itself is discarded; only the local repo matters.
      echo "=== Building main project ==="
      mvn -P${profile},nix package -Dmaven.repo.local=$out -DskipTests -q || true
      echo "=== First Maven build completed ==="
      # A second pass picks up anything missed (e.g. shade plugin artifacts).
      echo "=== Running second Maven pass ==="
      mvn -P${profile},nix package -Dmaven.repo.local=$out -DskipTests -q || true
      echo "=== Build finished ==="
    '';
    installPhase = ''
      # Remove resolver bookkeeping files that carry per-build state.
      find $out -type f \
        \( -name "*.lastUpdated" \
        -o -name "resolver-status.properties" \
        -o -name "_remote.repositories" \) \
        -delete

      # Safety net: drop any *-javadoc.jar that slipped through (see dokka.skip
      # above). Dokka-built javadoc jars embed wall-clock ZIP entry timestamps
      # and are not needed by the consuming build, so removing them keeps the
      # recursive output hash reproducible.
      find $out -type f -name "*-javadoc.jar" -delete

      # The locally installed coverage SNAPSHOT artifacts get maven-metadata
      # files whose timestamp elements record the install time. Pin them all to
      # a fixed value so the recursive output hash is reproducible across
      # machines, while keeping the metadata present for offline SNAPSHOT
      # resolution in the consuming build. The relevant elements are
      # <lastUpdated> (artifact-level), and <timestamp>/<updated> inside each
      # <snapshotVersion> entry (version-level maven-metadata-local.xml).
      find $out -type f -name "maven-metadata*.xml" -print0 \
        | while IFS= read -r -d "" meta; do
            sed -i \
              -e 's#<lastUpdated>[0-9]*</lastUpdated>#<lastUpdated>20240101000000</lastUpdated>#g' \
              -e 's#<timestamp>[0-9.]*</timestamp>#<timestamp>20240101.000000</timestamp>#g' \
              -e 's#<updated>[0-9]*</updated>#<updated>20240101000000</updated>#g' \
              "$meta"
          done
    '';
    dontFixup = true;
    outputHashAlgo = "sha256";
    outputHashMode = "recursive";
    # Deterministic across machines: coverage SNAPSHOT JARs are built with a
    # pinned project.build.outputTimestamp and maven-metadata timestamps are
    # normalized in installPhase (see above).
    outputHash = "sha256-Icu8IP2cDLkiWVnhVSEhc2Bs2d65AuzYm5xzqP9E3Tg=";
  };
in
stdenv.mkDerivation rec {
  pname = "operaton-bpm-extension-robot";
  version = "1.0-SNAPSHOT";

  # The Maven shade plugin produces this exact filename for the selected profile.
  name = "${pname}-${version}-${classifier}.jar";

  src = filteredSrc;

  buildInputs = [
    jdk_headless
    maven
  ];

  buildPhase = ''
    find . -print0 | xargs -0 touch

    VFSDIR=src/main/resources/org.graalvm.python.vfs

    # 1. Build GraalPy home/ from python-resources-25.0.3.jar
    # The jar contains:
    #   META-INF/resources/libpython/   -> VFS home/lib-python/  (Python stdlib)
    #   META-INF/resources/libgraalpy/  -> VFS home/lib-graalpython/ (GraalPy builtins)
    # GraalPy 25.0.3 ships native .so files as Truffle internal resources
    # (resolved at runtime via InternalResourceCache), not in VFS home/.
    PYTHON_RES_JAR=$(find ${mavenRepository} -name "python-resources-25.0.3.jar" | head -1)
    EXTRACT_TMP=$(mktemp -d)
    (cd "$EXTRACT_TMP" && jar xf "$PYTHON_RES_JAR" \
      META-INF/resources/libpython \
      META-INF/resources/libgraalpy)
    mkdir -p "$VFSDIR/home"
    cp -r "$EXTRACT_TMP/META-INF/resources/libpython"  "$VFSDIR/home/lib-python"
    cp -r "$EXTRACT_TMP/META-INF/resources/libgraalpy" "$VFSDIR/home/lib-graalpython"
    rm -rf "$EXTRACT_TMP"
    # tagfile tells graalpy-maven-plugin (if ever re-run) that home/ is current.
    printf '25.0.3\ninclude:.*' > "$VFSDIR/home/tagfile"

    # 2. Build venv/ from pre-fetched wheels
    # GraalPy 25.0.3 uses Python 3.12.  Wheels are ZIP archives; jar xf
    # extracts them without requiring unzip in the Nix sandbox.
    VENV_SITE="$VFSDIR/venv/lib/python3.12/site-packages"
    mkdir -p "$VENV_SITE"

    WHEEL_TMP=$(mktemp -d)
    (cd "$WHEEL_TMP" && jar xf ${robotframeworkWheel})
    cp -r "$WHEEL_TMP/robot"                          "$VENV_SITE/"
    cp -r "$WHEEL_TMP/robotframework-7.1.1.dist-info" "$VENV_SITE/"
    rm -rf "$WHEEL_TMP"

    WHEEL_TMP=$(mktemp -d)
    (cd "$WHEEL_TMP" && jar xf ${pythonlibcoreWheel})
    cp -r "$WHEEL_TMP/robotlibcore"                                    "$VENV_SITE/"
    cp -r "$WHEEL_TMP/robotframework_pythonlibcore-4.5.0.dist-info"    "$VENV_SITE/"
    rm -rf "$WHEEL_TMP"

    WHEEL_TMP=$(mktemp -d)
    (cd "$WHEEL_TMP" && jar xf ${robotremoteserverWheel})
    cp "$WHEEL_TMP/robotremoteserver.py"                               "$VENV_SITE/"
    cp -r "$WHEEL_TMP/robotremoteserver-1.1.1.dist-info"               "$VENV_SITE/"
    rm -rf "$WHEEL_TMP"

    # Minimal pyvenv.cfg - only the fields GraalPy checks at runtime.
    mkdir -p "$VFSDIR/venv/include/python3.12"
    touch     "$VFSDIR/venv/contents"
    printf 'include-system-site-packages = false\nversion = 3.12.8\n' \
      > "$VFSDIR/venv/pyvenv.cfg"

    # 3. Generate fileslist.txt
    # GraalPy's VirtualFileSystemContext reads this to enumerate VFS entries.
    # Directories end with /; the root and fileslist.txt itself come first.
    {
      echo "/org.graalvm.python.vfs/"
      echo "/org.graalvm.python.vfs/fileslist.txt"
      (cd src/main/resources && \
        find org.graalvm.python.vfs -mindepth 1 | LC_ALL=C sort | while read p; do
          if [ -d "$p" ]; then echo "/$p/"; else echo "/$p"; fi
        done)
    } > "$VFSDIR/fileslist.txt"

    # 4. Offline Maven build
    # -Pnix skips graalpy-maven-plugin (home/ and venv/ are already in place).
    # -P${profile} builds the selected shaded JAR.
    mvn -P${profile},nix package -DskipTests --offline \
      -Dmaven.repo.local=${mavenRepository}
  '';

  installPhase = ''
    mv target/${name} $out
  '';
}

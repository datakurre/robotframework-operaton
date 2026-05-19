{
  fetchurl,
  jdk_headless,
  maven,
  stdenv,
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
  mavenRepository = stdenv.mkDerivation {
    name = "operaton-bpm-extension-robot-maven-deps";
    src = filteredSrc;
    buildInputs = [
      jdk_headless
      maven
    ];
    buildPhase = ''
      # Run the full Maven build (with -Pnix skipping graalpy-maven-plugin)
      # so every artifact needed for an offline build is downloaded to $out.
      # The build output itself is discarded; only the local repo matters.
      mvn -Pshade,nix package -Dmaven.repo.local=$out -DskipTests -q || true
      # A second pass picks up anything missed (e.g. shade plugin artifacts).
      mvn -Pshade,nix package -Dmaven.repo.local=$out -DskipTests -q || true
    '';
    installPhase = ''
      find $out -type f \
        \( -name "*.lastUpdated" \
        -o -name "resolver-status.properties" \
        -o -name "_remote.repositories" \) \
        -delete
    '';
    dontFixup = true;
    outputHashAlgo = "sha256";
    outputHashMode = "recursive";
    # Run nix build with the placeholder hash once; replace with the hash
    # printed in the "got:" line of the resulting error.
    outputHash = "sha256-u8iF8UqSlBHtFLwFi8rikr6UtpHE612Pj/wUfF+s3BE=";
  };
in
stdenv.mkDerivation rec {
  pname = "operaton-bpm-extension-robot";
  version = "1.0-SNAPSHOT";

  # The Maven shade plugin (profile: shade) produces this exact filename.
  name = "${pname}-${version}-fat.jar";

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
    # -Pshade builds the fat JAR.
    mvn -Pshade,nix package -DskipTests --offline \
      -Dmaven.repo.local=${mavenRepository}
  '';

  installPhase = ''
    mv target/${name} $out
  '';
}

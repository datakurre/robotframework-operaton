# Upgrading versions

This document explains how to bump the versions of all components used in this
project and keep Maven and Nix builds in sync.

---

## Component inventory

| Component                           | Where pinned                                                       | Nix hash(es)                                              |
| ----------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| GraalPy                             | `pom.xml` `<graalpy.version>`                                      | `default.jar.nix` FOD `outputHash`                        |
| Operaton BPM                        | `pom.xml` `<operaton.version>`                                     | `default.jar.nix` FOD `outputHash`                        |
| Spring Boot BOM                     | `pom.xml` `<spring-boot.version>`                                  | `default.jar.nix` FOD `outputHash`                        |
| Robot Framework                     | `pom.xml` `<package>robotframework==X.Y.Z</package>`               | `default.jar.nix` `robotframeworkWheel` URL + `sha256`    |
| robotframework-pythonlibcore        | `pom.xml` `<package>robotframework-pythonlibcore==X.Y.Z</package>` | `default.jar.nix` `pythonlibcoreWheel` URL + `sha256`     |
| robotremoteserver                   | `pom.xml` `<package>robotremoteserver==X.Y.Z</package>`            | `default.jar.nix` `robotremoteserverWheel` URL + `sha256` |
| AGENTS.md / README.md version table | `AGENTS.md` `## Versions`                                          | —                                                         |

---

## 1. Maven-only dependencies (Operaton, Spring Boot BOM, GraalPy)

These are resolved by Maven at build time. Nix bakes the downloaded artifacts
into a fixed-output derivation (FOD); upgrading any of them requires
regenerating the FOD hash.

### Steps

1. Edit `pom.xml` — update the relevant property:

   ```xml
   <!-- GraalPy runtime and graalpy-maven-plugin -->
   <graalpy.version>25.0.3</graalpy.version>

   <!-- Operaton BPM engine + BOM -->
   <operaton.version>2.1.0</operaton.version>

   <!-- Spring Boot dependency BOM (transitive, test scope) -->
   <spring-boot.version>3.3.3</spring-boot.version>
   ```

2. **Also update the hardcoded GraalPy version string in `default.jar.nix`**
   if you changed `<graalpy.version>` — it appears in the `buildPhase`:

   ```nix
   PYTHON_RES_JAR=$(find ${mavenRepository} -name "python-resources-25.0.3.jar" | head -1)
   ```

   and in the `tagfile` line:

   ```nix
   printf '25.0.3\ninclude:.*' > "$VFSDIR/home/tagfile"
   ```

   Change both occurrences to the new version.

3. **Regenerate the Maven FOD hash** (see [Regenerating the FOD hash](#regenerating-the-fod-hash) below).

4. Verify:

   ```sh
   nix build
   devenv shell --no-eval-cache -- mvn test
   ```

---

## 2. Python wheels (Robot Framework, pythonlibcore, robotremoteserver)

These are bundled into the GraalPy VFS at build time. They are pinned in two
places that must be kept in sync.

### Steps

1. Update the version in `pom.xml` (used by `graalpy-maven-plugin` in the
   standard `mvn package` flow):

   ```xml
   <package>robotframework==7.1.1</package>
   <package>robotframework-pythonlibcore==4.5.0</package>
   <package>robotremoteserver==1.1.1</package>
   ```

2. Find the new wheel on PyPI. For each wheel:

   ```sh
   # Open the PyPI JSON API to find the exact wheel filename and URL:
   curl -s https://pypi.org/pypi/<package>/<version>/json \
     | python3 -c "
   import sys, json
   d = json.load(sys.stdin)
   for f in d['urls']:
       if f['packagetype'] == 'bdist_wheel':
           print(f['url'])
           print(f['digests']['sha256'])
   "
   ```

   Example output:

   ```
   https://files.pythonhosted.org/packages/.../robotframework-7.1.1-py3-none-any.whl
   0461360be00dfb8ce1ab3f42370fa6eea3779e41c0b879a1f8ddcd2ec8e3679...
   ```

3. Convert the hex SHA-256 to the Nix SRI format:

   ```sh
   nix-prefetch-url --type sha256 <wheel-url>
   # or
   python3 -c "
   import base64, sys
   h = '<hex-sha256-from-pypi>'
   print('sha256-' + base64.b64encode(bytes.fromhex(h)).decode())
   "
   ```

4. Update `default.jar.nix` — the `fetchurl` block for that wheel:

   ```nix
   robotframeworkWheel = fetchurl {
     url  = "https://files.pythonhosted.org/…/robotframework-7.2.0-py3-none-any.whl";
     sha256 = "sha256-<new-SRI-hash>";
   };
   ```

   Also update the `dist-info` directory name in the `buildPhase` extraction
   block (e.g. `robotframework-7.1.1.dist-info` → `robotframework-7.2.0.dist-info`).

5. **Regenerate the Maven FOD hash** — adding the new wheel to the VFS changes
   the offline Maven build output (see below).

6. Verify:

   ```sh
   nix build
   jar tf $(grep -o '/nix/store/[^ ]*\.jar' result/bin/operaton-robot) \
     | grep robotframework
   devenv shell --no-eval-cache -- mvn test
   ```

---

## Regenerating the FOD hash

The Maven fixed-output derivation (FOD) seals all downloaded Maven artifacts.
Whenever any Maven dependency version changes you must regenerate it.

1. **Set the hash to a placeholder** in `default.jar.nix`:

   ```nix
   outputHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
   ```

2. **Run `nix build`** — it will fail with:

   ```
   error: hash mismatch in fixed-output derivation …
      specified: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
         got:    sha256-u8iF8UqSlBHtFLwFi8rikr6UtpHE612Pj/wUfF+s3BE=
   ```

3. **Replace the placeholder** with the `got:` value:

   ```nix
   outputHash = "sha256-u8iF8UqSlBHtFLwFi8rikr6UtpHE612Pj/wUfF+s3BE=";
   ```

4. **Run `nix build` again** — it should succeed and produce `result/`.

---

## 3. JDK / devenv toolchain

The runtime JDK is pinned by the `nixpkgs` input in `flake.nix` and selected
in `flake.nix` / `devenv.nix`:

```nix
# flake.nix
nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";

# devenv.nix
languages.java.jdk.package = pkgs.jdk21;
```

To upgrade:

1. Point `nixpkgs.url` at a newer channel (e.g. `nixos-25.11` → `nixos-26.05`).
2. Run `nix flake update` to regenerate `flake.lock`.
3. Run `devenv shell --no-eval-cache -- mvn test` to verify.

---

## 4. Keeping documentation in sync

After any version bump, update the version table in `AGENTS.md`:

```markdown
## Versions

| Component          | Version |
| ------------------ | ------- |
| GraalPy            | 25.0.3  |
| Operaton BPM       | 2.1.0   |
| Spring Boot BOM    | 3.3.3   |
| Robot Framework    | 7.1.1   |
| JUnit Jupiter      | 5.10.2  |
| AssertJ            | 3.25.3  |
| Java source/target | 17      |
| Runtime JDK        | 21      |
```

---

## Quick upgrade checklist

```
[ ] pom.xml — update version property
[ ] default.jar.nix — update GraalPy version strings (if graalpy.version changed)
[ ] default.jar.nix — update wheel fetchurl URL + sha256 (if wheel version changed)
[ ] default.jar.nix — update dist-info name in buildPhase (if wheel version changed)
[ ] default.jar.nix — regenerate FOD outputHash (always)
[ ] AGENTS.md — update ## Versions table
[ ] nix build  ✓
[ ] devenv shell --no-eval-cache -- mvn test  ✓
```

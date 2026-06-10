{ pkgs, ... }:
let
  shell =
    { pkgs, ... }:
    {
      packages = [
        pkgs.gnumake
        pkgs.maven
        pkgs.mypy
        pkgs.google-java-format
        pkgs.nixfmt
        pkgs.prettier
        pkgs.treefmt
        pkgs.xmlformat
        pkgs.black
        pkgs.nodejs
      ];

      enterShell = ''
        # GraalPy 25.0.3 ensurepip expects _sysconfigdata__linux_x86_64-linux-gnu
        # which is not shipped in python-resources.  Create a minimal stub so
        # graalpy-maven-plugin can bootstrap pip inside the VFS venv.
        for d in "$HOME"/.cache/org.graalvm.polyglot/python/python-home/*/lib/python3.12; do
          if [ -d "$d" ] && [ ! -f "$d/_sysconfigdata__linux_x86_64-linux-gnu.py" ]; then
            printf "build_time_vars = {'SOABI': 'cpython-312-x86_64-linux-gnu', 'EXT_SUFFIX': '.cpython-312-x86_64-linux-gnu.so'}\n" \
              > "$d/_sysconfigdata__linux_x86_64-linux-gnu.py"
          fi
        done
      '';

      enterTest = ''
        mvn test
      '';
    };
in
{
  languages.java.enable = true;
  languages.java.jdk.package = pkgs.jdk21;

  languages.python.enable = true;
  languages.python.venv.enable = true;
  languages.python.venv.requirements = ''
    robotframework-robocop
    -e ./python
  '';

  profiles.shell.module = {
    imports = [ shell ];
  };
}

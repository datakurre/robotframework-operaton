let
  shell =
    { pkgs, ... }:
    {
      languages.java.enable = true;
      languages.java.jdk.package = pkgs.jdk21;

      languages.python.enable = true;
      languages.python.venv.enable = true;
      languages.python.venv.requirements = ''
        robotframework-robocop
        -e ./python
      '';

      packages = [
        pkgs.gnumake
        pkgs.maven
        pkgs.mypy
        pkgs.nixfmt
        pkgs.xmlformat
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

      treefmt = {
        enable = true;
        config = {
          settings.global = {
            excludes = [
              "target/**"
            ];
          };

          settings.formatter = {
            nixfmt = {
              command = "${pkgs.bash}/bin/bash";
              options = [
                "-euc"
                ''
                  for file in "$@"; do
                    tmp="$(mktemp)"
                    ${pkgs.nixfmt}/bin/nixfmt < "$file" > "$tmp"
                    if ! cmp -s "$tmp" "$file"; then
                      cat "$tmp" > "$file"
                    fi
                    rm -f "$tmp"
                  done
                ''
                "--"
              ];
              includes = [
                "*.nix"
              ];
            };

            black = {
              command = "${pkgs.black}/bin/black";
              includes = [
                "*.py"
                "*.pyi"
              ];
            };

            google-java-format = {
              command = "${pkgs.google-java-format}/bin/google-java-format";
              options = [ "--replace" ];
              includes = [ "*.java" ];
            };

            robocop = {
              command = "${pkgs.bash}/bin/bash";
              options = [
                "-euc"
                ''
                  for file in "$@"; do
                    if command -v robocop >/dev/null 2>&1; then
                      robocop format "$file"
                    elif [ -x .devenv/profiles/shell/state/venv/bin/robocop ]; then
                      .devenv/profiles/shell/state/venv/bin/robocop format "$file"
                    else
                      echo "robocop not available; skipping $file" >&2
                    fi
                  done
                ''
                "--"
              ];
              includes = [ "*.robot" ];
            };

            prettier = {
              command = "${pkgs.prettier}/bin/prettier";
              options = [ "--write" ];
              includes = [
                "*.js"
                "*.mjs"
                "*.json"
                "*.ts"
                "*.jsx"
                "*.tsx"
              ];
            };
          };
        };
      };

      git-hooks.hooks = {
        treefmt.enable = true;
      };

    };
in
{
  profiles.shell.module = {
    imports = [ shell ];
  };
}

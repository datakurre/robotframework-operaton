let
  shell =
    { pkgs, ... }:
    let
      robocop = pkgs.python3Packages.buildPythonApplication rec {
        pname = "robotframework-robocop";
        version = "8.2.10";

        src = pkgs.fetchFromGitHub {
          owner = "MarketSquare";
          repo = "robotframework-robocop";
          rev = "8c17ac6f7e5beaaaf3739711bf55732d372fb709";
          hash = "sha256-m+phKnm6gVhbG4oML31ypRoQsex2Gbr1MW+tWiVpxys=";
        };

        pyproject = true;
        build-system = [
          pkgs.python3Packages.hatchling
        ];

        dependencies = [
          pkgs.python3Packages.click
          pkgs.python3Packages.jinja2
          pkgs.python3Packages.robotframework
          pkgs.python3Packages.typer
          pkgs.python3Packages.rich
          pkgs.python3Packages.pathspec
          pkgs.python3Packages.platformdirs
          pkgs.python3Packages.pytz
          pkgs.python3Packages.msgpack
          pkgs.python3Packages.typing-extensions
          pkgs.python3Packages."tomli-w"
          pkgs.python3Packages.tomli
        ];

        doCheck = false;
      };
    in
    {
      languages.java.enable = true;
      languages.java.jdk.package = pkgs.jdk21;

      languages.python.enable = true;
      languages.python.venv.enable = true;
      languages.python.venv.requirements = ''
        robotcode
        -e ./python
      '';

      packages = [
        pkgs.gnumake
        pkgs.maven
        pkgs.mypy
        pkgs.xmlformat
        pkgs.nodejs
      ];

      enterShell = "make _fix-graalpy-sysconfig";

      treefmt = {
        enable = true;
        config = {
          settings.excludes = [
            "target/**"
            ".devenv/**"
          ];

          programs = {
            nixfmt.enable = true;
            black.enable = true;
            google-java-format.enable = true;
            prettier.enable = true;
          };

          settings.formatter.robocop = {
            command = "${robocop}/bin/robocop";
            options = [ "format" ];
            includes = [ "*.robot" ];
          };

          settings.formatter.prettier.includes = [
            "*.js"
            "*.mjs"
            "*.json"
            "*.ts"
            "*.jsx"
            "*.tsx"
          ];
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

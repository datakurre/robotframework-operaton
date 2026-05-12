{ pkgs, ... }:
let
  shell =
    { pkgs, ... }:
    {
      packages = [
        pkgs.gnumake
        pkgs.maven
        pkgs.google-java-format
        pkgs.nixfmt
        pkgs.prettier
        pkgs.treefmt
        pkgs.xmlformat
        pkgs.black
      ];

      enterTest = ''
        mvn test
      '';
    };
in
{
  dotenv.enable = true;

  languages.java.enable = true;
  languages.java.jdk.package = pkgs.jdk21;

  languages.python.enable = true;
  languages.python.venv.enable = true;
  languages.python.venv.requirements = "robotframework-robocop";

  profiles.shell.module = {
    imports = [ shell ];
  };
}

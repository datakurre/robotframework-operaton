{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    mvn2nix.url = "gitlab:vasara-bpm/mvn2nix";
    mvn2nix.inputs.nixpkgs.follows = "nixpkgs";
  };
  outputs =
    { self, nixpkgs, mvn2nix }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      operaton-robot-overlay = final: prev: {
        operaton-robot = final.callPackage ./default.nix {
          jar =
            let
              jdk_headless = prev.jdk21;
            in
            final.callPackage ./default.jar.nix {
              maven = prev.maven.override { inherit jdk_headless; };
              inherit jdk_headless;
            };
          jre = prev.jdk21;
        };
      };
      pkgsFor = forAllSystems (
        system:
        import nixpkgs {
          inherit system;
          overlays = [
            operaton-robot-overlay
          ];
        }
      );
    in
    {
      overlays.default = operaton-robot-overlay;
      apps = forAllSystems (system: {
        default = self.apps.${system}.operaton-robot;
        operaton-robot = {
          type = "app";
          program = "${pkgsFor.${system}.operaton-robot}/bin/operaton-robot";
        };
      });
      packages = forAllSystems (system:
        let
          pkgs = pkgsFor.${system};
        in
        {
          default = self.packages.${system}.operaton-robot;
          operaton-robot = pkgs.operaton-robot;
        }
      );
      formatter = forAllSystems (system: pkgsFor.${system}.nixfmt);
    };
}

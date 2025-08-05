{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs?ref=nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs [
          "x86_64-linux"
          "aarch64-linux"
        ] (system: function nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShellNoCC {
          buildInputs = with pkgs; [
            deno
            emscripten
            python3
            python3Packages.ply

            clang-tools
          ];

          CPLUS_INCLUDE_PATH = "${pkgs.emscripten}/share/emscripten/cache/sysroot/include";
        };
      });
    };
}

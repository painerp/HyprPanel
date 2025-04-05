{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      astal,
      ags,
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forEachSystem = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          extraPackages =
            with astal.packages.${system};
            [
              astal3
              io
              tray
              hyprland
              apps
              bluetooth
              battery
              mpris
              cava
              network
              notifd
              powerprofiles
              wireplumber
            ]
            ++ (with pkgs; [
              gjs
              typescript
              libnotify
              dart-sass
              fd
              bluez
              libgtop
              gobject-introspection
              glib
              bluez-tools
              grimblast
              brightnessctl
              (python3.withPackages (
                ps: with ps; [
                  gpustat
                  dbus-python
                  pygobject3
                ]
              ))
              matugen
              hyprpicker
              hyprsunset
              wireplumber
              networkmanager
              wf-recorder
              upower
              gvfs
              swww
              pywal
            ]);
        in
        {
          default = pkgs.stdenvNoCC.mkDerivation rec {
            src = ./.;
            name = "hyprpanel";

            nativeBuildInputs = [
              ags.packages.${system}.default
              pkgs.wrapGAppsHook
              pkgs.gobject-introspection
            ];

            buildInputs = extraPackages;

            preFixup = ''
              gappsWrapperArgs+=(
                --prefix PATH : ${with pkgs; lib.makeBinPath (extraPackages)}
              )
            '';

            installPhase = ''
              runHook preInstall

              mkdir -p $out/bin
              mkdir -p $out/share
              cp -r * $out/share
              ags bundle app.ts $out/bin/${name} -d "SRC='$out/share'"

              chmod +x $out/bin/${name}

              if ! head -n 1 "$out/bin/${name}" | grep -q "^#!"; then
                sed -i '1i #!/${pkgs.gjs}/bin/gjs -m' "$out/bin/${name}"
              fi

              runHook postInstall
            '';

          };
        }
      );

      # Define .overlay to expose the package as pkgs.hyprpanel based on the system
      overlay = final: prev: {
        hyprpanel = prev.writeShellScriptBin "hyprpanel" ''
          if [ "$#" -eq 0 ]; then
              exec ${self.packages.${final.stdenv.system}.default}/bin/hyprpanel
          else
              exec ${ags.packages.${final.stdenv.system}.io}/bin/astal -i hyprpanel "$*"
          fi
        '';
      };

      homeManagerModules.hyprpanel = import ./nix/module.nix self;
    };
}

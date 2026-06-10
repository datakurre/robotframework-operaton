{
  stdenv,
  jre,
  jar,
}:
let
  call-name = "operaton-robot";

in
stdenv.mkDerivation {
  name = call-name;
  src = jar;
  phases = [
    "installPhase"
    "fixupPhase"
  ];
  installPhase = ''
        mkdir -p $out/bin
        cat << EOF > $out/bin/${call-name}
    #!/usr/bin/env bash

    exec ${jre}/bin/java \$JAVA_OPTS -jar ${jar} "\$@"
    EOF
        chmod u+x $out/bin/${call-name}
  '';
}

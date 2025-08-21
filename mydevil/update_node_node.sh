#!/bin/sh
set -eu
# "set -e" oznacza "exit on error" - skrypt zatrzymuje się natychmiast gdy jakiekolwiek polecenie zwróci błąd (kod wyjścia !== 0).
# "set -u" (alias: set -o nounset) sprawia, że odwołanie do niezdefiniowanej zmiennej jest błędem - skrypt natychmiast się wywali ("unbound variable").

BIN="$HOME/bin"
OPT="$HOME/opt"
TMP="$OPT/tmp"
DST="$OPT/node"

echo "BIN: ${BIN}"
echo "OPT: ${OPT}"
echo "TMP: ${TMP}"
echo "DST: ${DST}"

rm -rf "$TMP" "$DST"
mkdir -p "$TMP" "$BIN"

fetch -o "$TMP/index.json" "https://nodejs.org/dist/index.json"

get_even_node_ver() {
  python3 - "$TMP/index.json" <<'PY'
import sys, json
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = json.load(f)
cur = data[0]["version"].lstrip("v")
maj = int(cur.split(".", 1)[0])
if maj % 2 == 0:
    print(cur); sys.exit(0)
for v in data:
    if v.get("lts"):
        print(v["version"].lstrip("v")); sys.exit(0)
sys.exit(1)
PY
}

VER="$(get_even_node_ver)" || exit 1
NAME="node-v${VER}-freebsd-amd64"
PKG="$NAME.tar.xz"
URL="https://nodejs.org/dist/v${VER}/${PKG}"

echo "VER: ${VER}"
echo "PKG: ${PKG}"
echo "URL: ${URL}"

echo "Installing Node v$VER"

cd "$OPT"
fetch -o "$OPT/$PKG" "$URL"
tar -xJvf "$OPT/$PKG" -C "$TMP"
mv "$TMP/$NAME" "$DST"

rm -rf "$TMP"
rm -f "$OPT/$PKG"

ln -sf "$DST/bin/node" "$HOME/bin/node"
ln -sf "$DST/bin/npm"  "$HOME/bin/npm"
ln -sf "$DST/bin/npx"  "$HOME/bin/npx"

echo "done"
echo "which node"
which node
echo "which npm"
which npm
echo "node --version"
node --version
echo "npm --version"
npm --version

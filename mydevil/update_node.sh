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

cd "$TMP"
fetch "https://nodejs.org/dist/index.json"

get_even_node_ver() {                 # <-- wypełniona funkcja: JSON → even
  python3 - "$TMP/index.json" <<'PY'  # <--
import sys, json
p = sys.argv[1]
try:
    with open(p, 'r', encoding='utf-8') as f:
        data = json.load(f)
except Exception:
    print("ERR: nie znaleziono wersji even", file=sys.stderr)
    sys.exit(1)

cur = data[0]["version"].lstrip("v")
maj = int(cur.split(".", 1)[0])
if maj % 2 == 0:
    print(cur); sys.exit(0)

for v in data:
    if v.get("lts"):
        print(v["version"].lstrip("v")); sys.exit(0)

print("ERR: nie znaleziono wersji even", file=sys.stderr)
sys.exit(1)
PY
}

VER="$(get_even_node_ver)" || exit 1
PKG="node-v${VER}.tar.xz"
URL="https://nodejs.org/dist/v${VER}/${PKG}"

echo "VER: ${VER}"
echo "PKG: ${PKG}"
echo "URL: ${URL}"

# rdzeń/rdzenie dla -j na FreeBSD
CORES="$(sysctl -n hw.ncpu 2>/dev/null || getconf NPROCESSORS_ONLN || echo 2)"

echo "CORES: ${CORES}"

# preferuj gmake, w razie czego spróbuj make (ale zalecany jest gmake)
if command -v gmake >/dev/null 2>&1; then MAKE="gmake"; else MAKE="make"; fi

echo "MAKE: ${MAKE}"

cd "$OPT"
fetch -o "$OPT/$PKG" "$URL"
tar -xJvf "$OPT/$PKG" -C "$TMP"

cd "$TMP/node-v${VER}"

command -v clang >/dev/null 2>&1 || { echo "Brak clang w PATH."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Brak python3 w PATH."; exit 1; }

./configure --prefix="$DST"
$MAKE -j"$CORES"
$MAKE install

cd "$OPT"
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

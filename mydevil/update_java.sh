#!/bin/sh
set -e
# "set -e" oznacza "exit on error" - skrypt zatrzymuje się natychmiast gdy jakiekolwiek polecenie zwróci błąd (kod wyjścia !== 0).

FREEBSD_VERSION=$(freebsd-version | cut -d'-' -f1 | cut -d'.' -f1)
echo "FreeBSD version: ${FREEBSD_VERSION}"
ABI="FreeBSD:${FREEBSD_VERSION}:amd64"
echo "ABI: ${ABI}"
BRANCH="latest"
echo "Branch: ${BRANCH}"
BASE="http://pkg.freebsd.org/$ABI/$BRANCH"
echo "BASE: ${BASE}"
OPT="$HOME/opt"
echo "OPT: ${OPT}"
TMP="$OPT/tmp"
echo "TMP: ${TMP}"
DST="$OPT/java"
echo "DST: ${DST}"

# https://ports.freebsd.org/cgi/ports.cgi?query=openjdk2&stype=all&sektion=all

PKG="openjdk24-24.0.2+12.1.pkg"
echo "PKG: ${PKG}"

rm -rf "$TMP" "$DST"
mkdir -p "$TMP"
cd "$OPT"
fetch "$BASE/All/$PKG"
tar -xJvf "$OPT/$PKG" -C "$TMP"
mv "$TMP/usr/local/openjdk24" "$DST"
rm -rf "$TMP"

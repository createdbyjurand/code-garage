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
DST="$OPT/node"
echo "DST: ${DST}"
NODE_LIB="$DST/lib"
echo "NODE_LIB: ${NODE_LIB}"

# https://pomoc.mydevil.net/Node.js/

# mkdir -p ~/bin
# ln -fs /usr/local/bin/node22 ~/bin/node
# ln -fs /usr/local/bin/npm22 ~/bin/npm
# source ~/.bash_profile

# https://ports.freebsd.org/cgi/ports.cgi?query=node24&stype=all&sektion=all
# https://www.freshports.org/www/npm-node24

# PKG_NODE="node24-24.4.1.pkg"
PKG_NODE="node22-22.17.1.pkg"
echo "PKG_NODE: ${PKG_NODE}"
# PKG_NPM="npm-node24-11.5.1.pkg" 
PKG_NPM="npm-node22-11.5.1.pkg" 
echo "PKG_NPM: ${PKG_NPM}"

rm -rf "$TMP" "$DST"
mkdir -p "$TMP"
cd "$OPT"
fetch "$BASE/All/$PKG_NODE"
tar -xJvf "$OPT/$PKG_NODE" -C "$TMP"
mv "$TMP/usr/local" "$DST"
rm -rf "$TMP"
rm "$PKG_NODE"

mkdir -p "$TMP"
fetch "$BASE/All/$PKG_NPM"
tar -xJvf "$OPT/$PKG_NPM" -C "$TMP"
cp -R "$TMP/usr/local/." "$DST/"
rm -rf "$TMP"
rm "$PKG_NPM"

# https://ports.freebsd.org/cgi/ports.cgi?query=node24&stype=all&sektion=all

# PKGS="
# brotli-1.1.0,1.pkg
# c-ares-1.34.5.pkg
# ca_root_nss-3.115.pkg
# gettext-runtime-0.23.1.pkg
# gmake-4.4.1.pkg
# icu-76.1,1.pkg
# indexinfo-0.3.1_1.pkg
# libffi-3.5.1.pkg
# liblz4-1.10.0,1.pkg
# libnghttp2-1.66.0.pkg
# libnghttp3-1.11.0.pkg
# libngtcp2-1.14.0.pkg
# libuv-1.51.0.pkg
# mpdecimal-4.0.1.pkg
# node24-24.4.1.pkg
# pkgconf-2.4.3,1.pkg
# python311-3.11.13_1.pkg
# readline-8.2.13_2.pkg
# riscv32-unknown-elf-binutils-2.44,1.pkg
# simdjson-3.13.0.pkg
# zstd-1.5.7.pkg
# "

# mkdir -p "$NODE_LIB"
# cd "$OPT"

# for pkg in $PKGS; do
#   echo "-> $pkg"
#   fetch "$BASE/All/$pkg"
#   mkdir -p "$TMP"
#   tar -xJvf "$OPT/$pkg" -C "$TMP"
#   if [ -d "$TMP/usr/local/lib" ]; then
#     cp -Rf "$TMP/usr/local/lib/"* "$NODE_LIB/"
#   fi
#   rm -rf "$TMP"
# done

echo "done"
# source ~/.bash_profile

echo "which node"
which node
echo "which npm"
which npm
echo "node --version"
node --version
echo "npm --version"
npm --version

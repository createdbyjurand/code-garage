@echo off
deno -V
deno upgrade
deno run --allow-write="%CD%" "%~dp0add.deno.ts" %*

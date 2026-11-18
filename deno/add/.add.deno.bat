@echo off
pushd "%~dp0"
call "E:\github\code-garage\deno\add\add.deno.bat" %*
popd
cmd /k

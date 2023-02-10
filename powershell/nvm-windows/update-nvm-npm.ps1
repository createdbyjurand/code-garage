Write-Host -NoNewline "(Removing) \npm-cache"
Remove-Item -Path "$env:APPDATA\npm-cache" -Recurse
Write-Host "`r[   OK   ]   (Removed) \npm-cache"

Write-Host -NoNewline "(Removing) \nodejs\npm"
Remove-Item -Path "$env:APPDATA\nodejs\npm"
Write-Host "`r[   OK   ]   (Removed) \nodejs\npm"

Write-Host -NoNewline "(Removing) \nodejs\npm.cmd"
Remove-Item -Path "$env:APPDATA\nodejs\npm.cmd"
Write-Host "`r[   OK   ]   (Removed) \nodejs\npm.cmd"

Write-Host -NoNewline "(Removing) \nodejs\npm.ps1"
Remove-Item -Path "$env:APPDATA\nodejs\npm.ps1"
Write-Host "`r[   OK   ]   (Removed) \nodejs\npm.ps1"

Write-Host -NoNewline "(Removing) \nodejs\npx"
Remove-Item -Path "$env:APPDATA\nodejs\npx"
Write-Host "`r[   OK   ]   (Removed) \nodejs\npx"

Write-Host -NoNewline "(Removing) \nodejs\npx.cmd"
Remove-Item -Path "$env:APPDATA\nodejs\npx.cmd"
Write-Host "`r[   OK   ]   (Removed) \nodejs\npx.cmd"

Write-Host -NoNewline "(Removing) \nodejs\npx.ps1"
Remove-Item -Path "$env:APPDATA\nodejs\npx.ps1"
Write-Host "`r[   OK   ]   (Removed) \nodejs\npx.ps1"

Write-Host -NoNewline "(Renaming) \nodejs\node_modules\npm to npm-old"
Rename-Item -Path "$env:APPDATA\nodejs\node_modules\npm" -NewName "npm-old"
Write-Host "`r[   OK   ]   (Renamed) \nodejs\node_modules\npm to npm-old"

Write-Host "(Installing) npm@latest"
Invoke-Expression -Command "node $env:APPDATA\nodejs\node_modules\npm-old\bin\npm-cli.js i -g npm@latest"
Write-Host "[   OK   ]   (Installed) npm@latest"

Write-Host -NoNewline "(Removing) \nodejs\node_modules\npm-old"
Remove-Item -Path "$env:APPDATA\nodejs\node_modules\npm-old" -Recurse
Write-Host "`r[   OK   ]   (Removed) \nodejs\node_modules\npm-old"

Write-Host "[  DONE  ]"

$NODE_VERSION = "12.11.0"

Write-Host -NoNewline "Remove-Item -Path $env:APPDATA\npm-cache -Recurse"
Remove-Item -Path "$env:APPDATA\npm-cache" -Recurse
Write-Host "`r[   OK   ]   Remove-Item -Path $env:APPDATA\npm-cache -Recurse"

                Write-Host "npm -g list --depth=0"
Invoke-Expression -Command "npm -g list --depth=0"

                Write-Host "npm -g outdated"
Invoke-Expression -Command "npm -g outdated"

                Write-Host "nvm uninstall $NODE_VERSION"
Invoke-Expression -Command "nvm uninstall $NODE_VERSION"

                Write-Host "nvm install $NODE_VERSION"
Invoke-Expression -Command "nvm install $NODE_VERSION"

                Write-Host "nvm use $NODE_VERSION"
Invoke-Expression -Command "nvm use $NODE_VERSION"

                Write-Host "npm i -g create-react-app@latest"
Invoke-Expression -Command "npm i -g create-react-app@latest"

                Write-Host "npm i -g @angular/cli@latest"
Invoke-Expression -Command "npm i -g @angular/cli@latest"

                Write-Host "npm -g list --depth=0"
Invoke-Expression -Command "npm -g list --depth=0"

                Write-Host "npm -g outdated"
Invoke-Expression -Command "npm -g outdated"

Write-Host "[  DONE  ]"

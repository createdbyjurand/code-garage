$OLD_NODE_VERSION = "12.10.0"
$NEW_NODE_VERSION = "12.11.0"

Write-Host -NoNewline "Remove-Item -Path $env:APPDATA\npm-cache -Recurse"
Remove-Item -Path "$env:APPDATA\npm-cache" -Recurse
Write-Host "`r[   OK   ]   Remove-Item -Path $env:APPDATA\npm-cache -Recurse"

                Write-Host "npm -g outdated"
Invoke-Expression -Command "npm -g outdated"

                Write-Host "nvm uninstall $NEW_NODE_VERSION"
Invoke-Expression -Command "nvm uninstall $NEW_NODE_VERSION"

                Write-Host "nvm install $NEW_NODE_VERSION"
Invoke-Expression -Command "nvm install $NEW_NODE_VERSION"

                Write-Host "nvm use $NEW_NODE_VERSION"
Invoke-Expression -Command "nvm use $NEW_NODE_VERSION"

                Write-Host "nvm uninstall $OLD_NODE_VERSION"
Invoke-Expression -Command "nvm uninstall $OLD_NODE_VERSION"

                Write-Host "npm i -g create-react-app@latest"
Invoke-Expression -Command "npm i -g create-react-app@latest"

                Write-Host "npm i -g @angular/cli@latest"
Invoke-Expression -Command "npm i -g @angular/cli@latest"

                Write-Host "npm -g outdated"
Invoke-Expression -Command "npm -g outdated"

Write-Host "[  DONE  ]"

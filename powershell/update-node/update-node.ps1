# PowerShell Script to update Node via NVM version 2.2.0
# powershell ./update-node.ps1
# powershell -ExecutionPolicy ByPass -File update-node.ps1

if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")) {
  Start-Process powershell "-NoProfile -NoExit -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs; exit
}

########################### functions ###########################

function Write-HostWithTab($left, $right) {
  $i = $terminalWindowWidth - $left.length - $right.length
  $s = " "
  while ($i -gt 2) {
    $s += "."
    $i--
  }
  $s += " "
  Write-Host -NoNewLine "`r$left" -ForegroundColor Cyan
  Write-Host -NoNewLine $s -ForegroundColor DarkGray
  Write-Host $right -ForegroundColor Green
}

function Remove-NpmCacheFolder {
  $Message = "Removing \npm-cache"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\npm-cache" -Recurse -ErrorAction Ignore
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpmFile {
  $Message = "Removing \nodejs\npm"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\npm"
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpmCmdFile {
  $Message = "Removing \nodejs\npm.cmd"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\npm.cmd"
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpmPs1File {
  $Message = "Removing \nodejs\npm.ps1"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\npm.ps1" -ErrorAction Ignore
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpxFile {
  $Message = "Removing \nodejs\npx"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\npx"
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpxCmdFile {
  $Message = "Removing \nodejs\npx.cmd"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\npx.cmd"
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpxPs1File {
  $Message = "Removing \nodejs\npx.ps1"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\npx.ps1" -ErrorAction Ignore
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Rename-NpmFolderToNpmOld {
  $Message = "Renaming \nodejs\node_modules\npm to npm_old"
  Write-Host -NoNewline $Message
  Rename-Item -Path "$env:APPDATA\nodejs\node_modules\npm" -NewName "npm_old"
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Install-LatestNpmVersionUsingNpmOldFolder {
  $Message = "Installing npm@latest"
  Write-Host -NoNewline $Message
  Invoke-Expression -Command "node `"$env:APPDATA\nodejs\node_modules\npm_old\bin\npm-cli.js`" i -g npm@latest"
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Remove-NpmOldFolder {
  $Message = "Removing \nodejs\node_modules\npm_old"
  Write-Host -NoNewline $Message
  Remove-Item -Path "$env:APPDATA\nodejs\node_modules\npm_old" -Recurse
  Write-HostWithTab -left $Message -right "[   OK   ]"
}

function Install-LatestNvmNodeVersion {
  $Command = "nvm install $latestNodeVersion"
  Write-Host -NoNewline $Command
  Invoke-Expression -Command $Command
  Write-HostWithTab -left $Command -right "[   OK   ]"
}

function Use-LatestNvmNodeVersion {
  $Command = "nvm use $latestNodeVersion"
  Write-Host -NoNewline $Command
  Invoke-Expression -Command $Command
  Write-HostWithTab -left $Command -right "[   OK   ]"
}

function Install-LatestNvmNodeLtsVersion {
  $Command = "nvm install $latestNodeLtsVersion"
  Write-Host -NoNewline $Command
  Invoke-Expression -Command $Command
  Write-HostWithTab -left $Command -right "[   OK   ]"
}

function Use-LatestNvmNodeLtsVersion {
  $Command = "nvm use $latestNodeLtsVersion"
  Write-Host -NoNewline $Command
  Invoke-Expression -Command $Command
  Write-HostWithTab -left $Command -right "[   OK   ]"
}

function Uninstall-OldNvmNodeVersion {
  $Command = "nvm uninstall $currentNodeVersion"
  Write-Host -NoNewline $Command
  Invoke-Expression -Command $Command
  Write-HostWithTab -left $Command -right "[   OK   ]"
}

function Install-LatestCreateReactAppGlobally {
  Write-Host "Do you want to install latest create-react-app globally?" -ForegroundColor Green
  $Input = Read-Host -Prompt "Y/N?"
  if ($Input -eq "Y" -Or $Input -eq "y") {
    $Command = "npm i -g create-react-app@latest"
    Write-Host -NoNewline $Command
    Invoke-Expression -Command $Command
    Write-HostWithTab -left $Command -right "[   OK   ]"
  }
}

function Install-LatestAngularCLIGlobally {
  Write-Host "Do you want to install latest @angular/cli globally?" -ForegroundColor Green
  $Input = Read-Host -Prompt "Y/N?"
  if ($Input -eq "Y" -Or $Input -eq "y") {
    $Command = "npm i -g @angular/cli@latest"
    Write-Host -NoNewline $Command
    Invoke-Expression -Command $Command
    Write-HostWithTab -left $Command -right "[   OK   ]"
  }
}

function Write-HostGlobalNodeDependencies {
  $Command = "npm -g list --depth=0"
  Write-Host -NoNewline $Command
  Invoke-Expression -Command $Command
  Write-HostWithTab -left $Command -right "[   OK   ]"
}

########################### middleware functions ###########################

function Update-Node {
  Remove-NpmCacheFolder
  Install-LatestNvmNodeVersion
  Use-LatestNvmNodeVersion
  Uninstall-OldNvmNodeVersion
  Install-LatestCreateReactAppGlobally
  Install-LatestAngularCLIGlobally
  Write-HostGlobalNodeDependencies
}

function Update-NodeLts {
  Remove-NpmCacheFolder
  Install-LatestNvmNodeLtsVersion
  Use-LatestNvmNodeLtsVersion
  Uninstall-OldNvmNodeVersion
  Install-LatestCreateReactAppGlobally
  Install-LatestAngularCLIGlobally
  Write-HostGlobalNodeDependencies
}

function Update-Npm {
  Remove-NpmCacheFolder
  Remove-NpmFile
  Remove-NpmCmdFile
  Remove-NpmPs1File
  Remove-NpxFile
  Remove-NpxCmdFile
  Remove-NpxPs1File
  Rename-NpmFolderToNpmOld
  Install-LatestNpmVersionUsingNpmOldFolder
  Remove-NpmOldFolder
}

########################### code ###########################

if (!$host) {
  $host = Get-Host
}

$terminalWindowWidth = $host.ui.rawui.windowsize.width

$latestNodeVersion = nvm list available
$latestNodeVersion = $latestNodeVersion[3].split("|")
$latestNodeLtsVersion = $latestNodeVersion[2].replace(" ", "")
$latestNodeVersion = $latestNodeVersion[1].replace(" ", "")

$currentNodeVersion = node -v
$currentNodeVersion = $currentNodeVersion.Substring(1)
$currrentNpmVersion = npm -v

$TableData = @{
  "Installed" = $currentNodeVersion;
  "Current" = $latestNodeVersion;
  "LTS" = $latestNodeLtsVersion;
}
$Table = New-Object -TypeName PSObject -Property $TableData
$Table | Format-Table Installed, Current, LTS

if ($currentNodeVersion -ne $latestNodeVersion -And $currentNodeVersion -ne $latestNodeLtsVersion) {
  Write-Host "Do you want to install new Node version?" -ForegroundColor Green
  $Input = Read-Host -Prompt "Y/N?"
  if ($Input -eq "Y" -Or $Input -eq "y") {
    Write-Host "C: Current $latestNodeVersion" -ForegroundColor Magenta
    Write-Host "L: LTS $latestNodeLtsVersion" -ForegroundColor Magenta
    $Input = Read-Host -Prompt "C/L?"
    if ($Input -eq "C" -Or $Input -eq "c") {
      Update-Node
    } elseif ($Input -eq "L" -Or $Input -eq "l") {
      Update-NodeLts
    }
  }
} else {
  Write-Host "Do you want to change Node version?" -ForegroundColor Green
  $Input = Read-Host -Prompt "Y/N?"
  if ($Input -eq "Y" -Or $Input -eq "y") {
    Write-Host "C: Current $latestNodeVersion" -ForegroundColor Magenta
    Write-Host "L: LTS $latestNodeLtsVersion" -ForegroundColor Magenta
    $Input = Read-Host -Prompt "C/L?"
    if ($Input -eq "C" -Or $Input -eq "c") {
      Update-Node
    } elseif ($Input -eq "L" -Or $Input -eq "l") {
      Update-NodeLts
    }
  }
}

$currrentNpmVersion = npm -v
$latestNpmVersion = ""
$npmGloballyOutdated = npm -g outdated

foreach ($line in $npmGloballyOutdated) {
  if ($line -match "^npm.*$") {
    $latestNpmVersion = ($line -split "\s+")[3]
    Break
  }
}

if ($currrentNpmVersion -ne $latestNpmVersion -And $latestNpmVersion -ne "") {
  $Input = Read-Host -Prompt "Do you want to update Npm? Y/N"
  if ($Input -eq "Y" -Or $Input -eq "y") {
    Update-Npm
  }
} else {
  Write-Host "Npm seems to be up to date" -ForegroundColor Green
  $Input = Read-Host -Prompt "Do you want to force update Npm? Y/N"
  if ($Input -eq "Y" -Or $Input -eq "y") {
    Update-Npm
  }
}

Write-HostWithTab -left "Script ended" -right "[  DONE  ]"

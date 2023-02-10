# powershell -ExecutionPolicy ByPass -File test.ps1

$latestNodeVersion = nvm list available
$latestNodeVersion = $latestNodeVersion[3].split("|")
$latestNodeLtsVersion = $latestNodeVersion[2].replace(" ", "")
$latestNodeVersion = $latestNodeVersion[1].replace(" ", "")

Write-Host -NoNewLine "-"
Write-Host -NoNewLine $latestNodeVersion
Write-Host "-"

Write-Host -NoNewLine "-"
Write-Host -NoNewLine $latestNodeLtsVersion
Write-Host "-"

$currentNodeVersion = node -v
$currentNodeVersion = $currentNodeVersion.Substring(1)
$currrentNpmVersion = npm -v

Write-Host -NoNewLine "-"
Write-Host -NoNewLine $currentNodeVersion
Write-Host "-"

Write-Host -NoNewLine "-"
Write-Host -NoNewLine $currrentNpmVersion
Write-Host "-"

if (!$host) { $host = Get-Host }
$terminalWindowWidth = $host.ui.rawui.windowsize.width

function Write-HostWithTab($left, $right) {
  $i = $terminalWindowWidth - $left.length - $right.length
  $s = " "
  while ($i -gt 2) {
    $s += "."
    $i--
  }
  $s += " "
  Write-Host -NoNewLine "`r$left"  -ForegroundColor Red
  Write-Host -NoNewLine $s -ForegroundColor DarkGray
  Write-Host $right -ForegroundColor Magenta
}

Write-HostWithTab -left "node" -right "[   OK   ]"


$currrentNpmVersion = npm -v
$latestNpmVersion = ""
$npmGloballyOutdated = npm -g outdated

foreach ($line in $npmGloballyOutdated) {
  if ($line -match "^npm.*$") {
    $latestNpmVersion = ($line -split "\s+")[3]
    Break
  }
}

Write-Host -NoNewLine "-"
Write-Host -NoNewLine $currrentNpmVersion
Write-Host "-"

Write-Host -NoNewLine "-"
Write-Host -NoNewLine $latestNpmVersion
Write-Host "-"

$message = "Removing npm-cache"
Write-Host -NoNewline $message
Write-HostWithTab -left $message -right "[   OK   ]"

$message = "Installing npm@latest"
Write-Host -NoNewline $message
Invoke-Expression -Command "node `"$env:APPDATA\nodejs\node_modules\npm_old\bin\npm-cli.js`" i -g npm@latest"
Write-HostWithTab -left $message -right "[   OK   ]"

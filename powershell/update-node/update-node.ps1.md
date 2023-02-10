# Powershell

## Notes

# Start-Process powershell "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs; exit
# Start-Process powershell -Verb runAs
# Requires -RunAsAdministrator

function Start-PSAdmin {Start-Process PowerShell -Verb RunAs}

### Use the length property of the [String] type:

if ($dbUserName.length -gt 8) {
    Write-Output "Please enter more than 8 characters."
    $dbUserName = Read-Host "Re-enter database username"
}

Please note that you have to use -gt instead of > in your if condition. PowerShell uses the following comparison operators to compare values and test conditions:

-eq = equals
-ne = not equals
-lt = less than
-gt = greater than
-le = less than or equals
-ge = greater than or equals

### You can also use -match against a Regular expression. Ex:

if ($dbUserName -match ".{8}" )
{
    Write-Output " Please enter more than 8 characters "
    $dbUserName=read-host " Re-enter database user name"
}

## Colors

-BackgroundColor

Black
DarkBlue
DarkGreen
DarkCyan
DarkRed
DarkMagenta
DarkYellow
Gray
DarkGray
Blue
Green
Cyan
Red
Magenta
Yellow
White

-ForegroundColor

Black
DarkBlue
DarkGreen
DarkCyan
DarkRed
DarkMagenta
DarkYellow
Gray
DarkGray
Blue
Green
Cyan
Red
Magenta
Yellow
White

-NoNewline

## HERE IS THE COMPLETE LIST OF POWERSHELL’S COMPARISON OPERATORS

-eq
-ne
-gt
-ge
-lt
-le
-Like
-NotLike
-Match
-NotMatch
-Contains
-NotContains
-In
-NotIn
-Replace

26

If you want to suppress the error message and continue executing, you need to use -ErrorAction Ignore or -ErrorAction SilentlyContinue.

See Get-Help about_CommonParameters:

 -ErrorAction[:{Continue | Ignore | Inquire | SilentlyContinue | Stop |
     Suspend }]
     Alias: ea
     
     
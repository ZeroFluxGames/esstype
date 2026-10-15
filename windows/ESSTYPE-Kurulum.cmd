@echo off
chcp 65001 >nul
title ESSTYPE Kurulum
set "SRC=%~dp0"
if not exist "%SRC%esstype.html" (
  echo [HATA] esstype.html bulunamadi.
  echo Zip dosyasini once sag tik ^> "Tumunu ayikla" ile klasore cikarin,
  echo sonra cikan klasordeki ESSTYPE-Kurulum dosyasini calistirin.
  pause
  exit /b 1
)
for /f "usebackq delims=" %%D in (`powershell -NoProfile -Command "[Environment]::GetFolderPath('MyDocuments')"`) do set "DOCS=%%D"
if "%DOCS%"=="" set "DOCS=%USERPROFILE%\Documents"
set "DST=%DOCS%\ESSTYPE"
if not exist "%DST%" mkdir "%DST%"
copy /Y "%SRC%esstype.html" "%DST%\esstype.html" >nul
if exist "%SRC%esstype.ico" copy /Y "%SRC%esstype.ico" "%DST%\esstype.ico" >nul
if not exist "%DST%\esstype.html" (
  echo [HATA] Dosya kopyalanamadi. Uygulamayi kurulumsuz aciyorum.
  start "" "%SRC%esstype.html"
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -Command "$a=$env:DST; $f=Join-Path $a 'esstype.html'; $e=@(\"${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe\",\"$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe\") | Where-Object {Test-Path $_} | Select-Object -First 1; $w=New-Object -ComObject WScript.Shell; foreach($d in @([Environment]::GetFolderPath('Desktop'),[Environment]::GetFolderPath('Programs'))){ $l=$w.CreateShortcut((Join-Path $d 'ESSTYPE.lnk')); if($e){ $l.TargetPath=$e; $l.Arguments='--app=\"'+([uri]$f).AbsoluteUri+'\" --start-maximized' } else { $l.TargetPath=$f }; $l.IconLocation=(Join-Path $a 'esstype.ico')+',0'; $l.WorkingDirectory=$a; $l.Save() }"
echo.
echo ESSTYPE kuruldu: %DST%
echo Masaustundeki ESSTYPE kisayoluyla acabilirsiniz.
start "" "%DST%\esstype.html"
timeout /t 5 >nul

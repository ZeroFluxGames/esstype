@echo off
rem ESSTYPE kurulumu: dosyalari Belgeler\ESSTYPE klasorune kopyalar,
rem masaustu ve Baslat menusu kisayolu olusturur (Microsoft Edge uygulama penceresi).
set "SRC=%~dp0"
set "DST=%USERPROFILE%\Documents\ESSTYPE"
if not exist "%DST%" mkdir "%DST%"
copy /Y "%SRC%esstype.html" "%DST%\esstype.html" >nul
copy /Y "%SRC%esstype.ico" "%DST%\esstype.ico" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$q=[char]34; $e='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'; $a=$env:USERPROFILE+'\Documents\ESSTYPE'; $u='file:///'+($a -replace '\\','/')+'/esstype.html'; $w=New-Object -ComObject WScript.Shell; foreach($p in @(([Environment]::GetFolderPath('Desktop')+'\ESSTYPE.lnk'),([Environment]::GetFolderPath('Programs')+'\ESSTYPE.lnk'))){ $l=$w.CreateShortcut($p); $l.TargetPath=$e; $l.Arguments='--app='+$q+$u+$q+' --start-maximized'; $l.IconLocation=$a+'\esstype.ico,0'; $l.WorkingDirectory=$a; $l.Description='ESSTYPE'; $l.Save() }"
echo ESSTYPE kuruldu. Masaustundeki ESSTYPE ikonuyla acabilirsin.
start "" "%USERPROFILE%\Desktop\ESSTYPE.lnk"

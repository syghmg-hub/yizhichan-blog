@echo off
chcp 65001 >nul
title 一只蝉 - 本地预览
set PATH=%~dp0.tools\node-v22.23.3-win-x64;%PATH%

echo.
echo   正在启动本地预览（浏览器会自动打开）...
echo   关闭这个黑色窗口即停止预览。
echo.

start "" http://localhost:4321
call "%~dp0.tools\node-v22.23.3-win-x64\npm.cmd" run dev

pause

@echo off
chcp 65001 >nul
title 一只蝉 - 更新线上版本
set PATH=%~dp0.tools\node-v22.23.3-win-x64;%PATH%

echo.
echo   1/3 检查代码...
call "%~dp0.tools\node-v22.23.3-win-x64\npm.cmd" run build || goto :fail

echo.
echo   2/3 提交改动...
git add -A
git commit -m "update: %date% %time%"
if errorlevel 1 echo   （没有需要提交的改动，跳过）

echo.
echo   3/3 推送到 GitHub（几秒后线上自动更新）...
git push

echo.
echo   完成！现在刷新线上网站就能看到更新。
pause
exit /b 0

:fail
echo.
echo   构建失败，请把上面的红色报错发给 AI 帮忙排查。
pause
exit /b 1

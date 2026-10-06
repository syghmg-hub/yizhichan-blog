@echo off
chcp 65001 >nul
title 一只蝉 - 打开博客与后台

set BLOG=https://yizhichan-blog.vercel.app/
set ADMIN=https://yizhichan-blog.vercel.app/admin

rem 优先用 Chrome 打开（后台登录需要 Chrome，Edge 会拦登录弹窗）
set CHROME=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
if exist "%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe" set CHROME=%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe

echo.
if defined CHROME (
  echo   用 Chrome 打开博客与后台...
) else (
  echo   未找到 Chrome，改用默认浏览器打开...
)
echo.

if defined CHROME (
  start "" "%CHROME%" "%BLOG%"
  timeout /t 2 /nobreak >nul
  start "" "%CHROME%" "%ADMIN%"
) else (
  start "" "%BLOG%"
  timeout /t 2 /nobreak >nul
  start "" "%ADMIN%"
)

echo   已打开两个标签页：博客首页 + 写作后台。
timeout /t 3 /nobreak >nul
exit /b 0
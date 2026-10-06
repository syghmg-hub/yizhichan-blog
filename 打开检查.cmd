@echo off
chcp 65001 >nul
title 一只蝉 - 打开博客与后台

set BLOG=https://yizhichan-blog.vercel.app/
set ADMIN=https://yizhichan-blog.vercel.app/admin

echo.
echo   正在打开博客和写作后台...
echo   注意：后台登录需要用 Chrome（Edge 可能拦截登录弹窗）
echo.

start "" "%BLOG%"
timeout /t 1 /nobreak >nul
start "" "%ADMIN%"

echo   已打开两个标签页。看完关掉本窗口即可。
timeout /t 4 /nobreak >nul
exit /b 0
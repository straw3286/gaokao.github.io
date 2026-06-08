@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  正在启动本地预览服务器...
echo  请在浏览器打开: http://localhost:8080/index.html
echo  按 Ctrl+C 停止服务
echo.
npx --yes serve -l 8080 .

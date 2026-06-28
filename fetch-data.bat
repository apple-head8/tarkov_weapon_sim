@echo off
setlocal

cd /d "%~dp0frontend"

node scripts\fetchData.js
if errorlevel 1 (
    echo.
    echo Data fetch failed.
    exit /b 1
)

echo.
echo Data fetch completed.

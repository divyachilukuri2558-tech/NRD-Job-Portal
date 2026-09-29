@echo off
title Job Portal Launcher
echo ========================================================
echo       Launching Job Portal Web Application
echo ========================================================
set PATH=C:\Users\divya\.gemini\antigravity\tools\node-v20.18.0-win-x64;%PATH%

:: 1. Check if backend is already running on port 5000
netstat -ano | findstr :5000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] Backend server is already running on port 5000.
) else (
    echo [INFO] Starting Backend Server on port 5000...
    start "Job Portal Server" cmd /k "title Job Portal Server & cd /d "%~dp0backend" & node server.js"
    timeout /t 3 /nobreak >nul
)

:: 2. Automatically open web application in browser
echo.
echo ========================================================
echo Opening Job Portal in your web browser...
echo URL: http://localhost:5000/
echo ========================================================
start "" "http://localhost:5000/"

echo.
echo Application is ready!
echo - Main Website:  http://localhost:5000/
echo - REST APIs:     http://localhost:5000/api
echo ========================================================
ping 127.0.0.1 -n 3 >nul

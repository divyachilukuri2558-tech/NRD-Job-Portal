@echo off
title Job Portal - Backend Server
echo ========================================================
echo Starting Job Portal Backend REST API Server (Node.js/Express)
echo ========================================================
set PATH=C:\Users\divya\.gemini\antigravity\tools\node-v20.18.0-win-x64;%PATH%
cd /d "%~dp0backend"
node server.js
pause

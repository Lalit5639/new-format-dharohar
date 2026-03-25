@echo off
REM ========================================
REM AgriGro Order System - Quick Start
REM ========================================

echo.
echo 🌾 AgriGro Order System - Starting...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
    echo.
)

REM Clear screen
cls

echo.
echo ════════════════════════════════════════
echo    🚀 AgriGro Order System Running
echo ════════════════════════════════════════
echo.
echo 📍 Server URL: http://localhost:3000
echo 📝 Form URL:  http://localhost:3000/order.html
echo.
echo ⏻ Press Ctrl+C to stop the server
echo.
echo ════════════════════════════════════════
echo.

REM Start the server
npm start

pause

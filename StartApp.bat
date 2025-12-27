@echo off
setlocal enabledelayedexpansion

echo ==============================
echo Starting Bharat Panchayat App
echo ==============================
echo.

REM Quick checks (no output unless error)
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Install from https://www.python.org/
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Install from https://nodejs.org/
    pause
    exit /b 1
)

REM --- Backend ---
set "BACKEND_DIR=%~dp0backend"
cd /d "%BACKEND_DIR%"

if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

REM Quick dependency check - only install if missing
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing backend dependencies...
    pip install -q -r requirements.txt
)

echo Starting Backend...
start "Backend Server" cmd /k "cd /d "%BACKEND_DIR%" && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

REM --- Frontend ---
set "FRONTEND_DIR=%~dp0frontend"
cd /d "%FRONTEND_DIR%"

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install --silent
)

echo Starting Frontend...
start "Frontend Server" cmd /k "cd /d "%FRONTEND_DIR%" && npm start"

echo.
echo ==============================
echo Servers Starting...
echo ==============================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Browser will open in 8 seconds...
ping 127.0.0.1 -n 9 >nul

start http://localhost:3000

echo.
echo [OK] App is starting!
echo Keep both terminal windows open.
echo.
pause

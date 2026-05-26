@echo off
chcp 65001 >nul
echo =====================================
echo    Weather API Test Script
echo =====================================
echo.

set "SCRIPT_DIR=%~dp0"
set "KEY_FILE=%SCRIPT_DIR%key"
set "ROOT_DIR=%SCRIPT_DIR%.."

rem Read API Key
if not exist "%KEY_FILE%" (
    echo Error: key file not found
    echo Please create a 'key' file in the test directory with your API Key
    exit /b 1
)

set /p API_KEY=<"%KEY_FILE%"
set API_KEY=%API_KEY: =%

if "%API_KEY%"=="" (
    echo Error: key file is empty
    exit /b 1
)

echo Installing dependencies...
call pnpm install --frozen-lockfile --dir app
if errorlevel 1 (
    echo Dependency installation failed!
    exit /b 1
)

echo.
echo Starting dev server...
echo API Key: %API_KEY:~0,8%...
echo.

set "VITE_QWEATHER_API_KEY=%API_KEY%"
call pnpm --dir app run dev

@echo off
REM ============================================================================
REM Upgrade Expo to SDK 54 to match Expo Go
REM ============================================================================

echo.
echo ============================================================================
echo   Upgrade Expo to SDK 54
echo ============================================================================
echo.

echo [INFO] Your Expo Go is for SDK 54.0.0
echo [INFO] Upgrading project to SDK 54...
echo.

pause

echo.
echo [STEP 1] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [STEP 2] Removing node_modules...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo [STEP 3] Installing Expo SDK 54...
npm install expo@~54.0.0 --legacy-peer-deps

echo.
echo [STEP 4] Fixing Expo dependencies...
npx expo install --fix --legacy-peer-deps

echo.
echo [STEP 5] Installing all dependencies...
npm install --legacy-peer-deps

echo.
echo [STEP 6] Starting Expo dev server...
npx expo start --clear

echo.
echo ============================================================================
echo   DONE!
echo ============================================================================
echo.

pause

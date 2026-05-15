@echo off
REM ============================================================================
REM Downgrade Expo SDK to be compatible with older Expo Go
REM ============================================================================

echo.
echo ============================================================================
echo   Downgrade Expo SDK for Compatibility
echo ============================================================================
echo.

echo [INFO] Current Expo version: 55.0.18
echo [INFO] Downgrading to: 52.0.0 (compatible with older Expo Go)
echo.

pause

echo.
echo [STEP 1] Downgrading Expo to SDK 52...
npm install expo@~52.0.0

echo.
echo ============================================================================
echo.

echo [STEP 2] Updating Expo dependencies...
npx expo install --fix

echo.
echo ============================================================================
echo.

echo [STEP 3] Reinstalling dependencies...
npm install

echo.
echo ============================================================================
echo.

echo [STEP 4] Clearing cache...
npx expo start --clear

echo.
echo ============================================================================
echo   DONE!
echo ============================================================================
echo.
echo   Your project is now compatible with older Expo Go versions.
echo.
echo   Next steps:
echo   1. Open Expo Go on your phone
echo   2. Scan the QR code
echo   3. Your app should load successfully
echo.
echo ============================================================================
echo.

pause

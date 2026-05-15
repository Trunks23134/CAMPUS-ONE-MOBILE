@echo off
REM ============================================================================
REM Fix NPM Vulnerabilities - Automated Script
REM ============================================================================

echo.
echo ============================================================================
echo   Fix NPM Vulnerabilities
echo ============================================================================
echo.

echo [STEP 1] Checking current vulnerabilities...
npm audit

echo.
echo ============================================================================
echo.

echo [STEP 2] Updating Expo to latest version...
npm install expo@latest

echo.
echo ============================================================================
echo.

echo [STEP 3] Fixing Expo dependencies...
npx expo install --fix

echo.
echo ============================================================================
echo.

echo [STEP 4] Running npm audit fix...
npm audit fix

echo.
echo ============================================================================
echo.

echo [STEP 5] Verifying fixes...
npm audit

echo.
echo ============================================================================
echo   DONE!
echo ============================================================================
echo.
echo   If you still see vulnerabilities, run:
echo   npm audit fix --force
echo.
echo   Then test your app:
echo   npx expo start --clear
echo.
echo ============================================================================
echo.

pause

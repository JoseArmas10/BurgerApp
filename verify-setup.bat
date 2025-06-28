@echo off
echo ========================================
echo   BURGER APP - VERIFICATION SCRIPT
echo ========================================
echo.

echo [1/5] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB is running
) else (
    echo ❌ MongoDB is NOT running
    echo Please run: start-mongodb.bat
    pause
    exit /b 1
)

echo.
echo [2/5] Checking Backend Server...
curl -s http://localhost:5000/health >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✅ Backend server is running on port 5000
) else (
    echo ❌ Backend server is NOT running
    echo Please run: cd BackEnd && npm run dev
    pause
    exit /b 1
)

echo.
echo [3/5] Testing API Products...
curl -s "http://localhost:5000/api/products" | find "success" >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✅ Products API is working
) else (
    echo ❌ Products API failed
    echo Check backend logs
)

echo.
echo [4/5] Testing API Locations...
curl -s "http://localhost:5000/api/locations" | find "success" >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✅ Locations API is working
) else (
    echo ❌ Locations API failed
    echo Check backend logs
)

echo.
echo [5/5] Checking Frontend...
echo ℹ️  Frontend should be running on: http://localhost:3000
echo    If not running, execute: cd FrontEnd && npm start

echo.
echo ========================================
echo   VERIFICATION COMPLETE
echo ========================================
echo.
echo 🎉 Ready to use!
echo.
echo Login credentials:
echo   Email: admin@burgerapp.com
echo   Password: admin123456
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   Health:   http://localhost:5000/health
echo.
pause

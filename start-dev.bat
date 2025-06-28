@echo off
echo Starting Burger App - Full Stack Development
echo.

echo [1/3] Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is already running
) else (
    echo ⚠ MongoDB is not running. Please start MongoDB first.
    echo You can start MongoDB with: mongod
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Backend Server...
cd /d "c:\Users\Jose_\OneDrive\Documents\Jose\Proyectos\BurgerApp\BackEnd"
start "Backend Server" cmd /k "npm run dev"

echo.
echo [3/3] Starting Frontend Development Server...
cd /d "c:\Users\Jose_\OneDrive\Documents\Jose\Proyectos\BurgerApp\FrontEnd"
start "Frontend Server" cmd /k "npm start"

echo.
echo ✓ Both servers are starting...
echo ✓ Backend: http://localhost:5000
echo ✓ Frontend: http://localhost:3000
echo ✓ Health Check: http://localhost:5000/health
echo.
echo Press any key to exit...
pause >nul

@echo off
echo Starting MongoDB for Burger App...
echo.

set MONGODB_PATH="C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
set DATA_PATH="c:\Users\Jose_\OneDrive\Documents\Jose\Proyectos\BurgerApp\mongodb-data"

echo MongoDB Path: %MONGODB_PATH%
echo Data Path: %DATA_PATH%
echo.

echo Starting MongoDB server...
%MONGODB_PATH% --dbpath %DATA_PATH% --port 27017

pause

@echo off
REM Windows cmd pre-push hook to run checks before push
call npm run check-all
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
call npm run test
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

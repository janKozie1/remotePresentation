@echo off
set "str1=%~dp0"
set "str2=node_modules"
set "str3=%str1%%str2%"

IF EXIST %str3% (  
 echo - 	
) ELSE (
 npm install
)
node server.js



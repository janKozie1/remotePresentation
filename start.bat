@echo off
set "str1=%~dp0"
set "str2=node_modules"
set "str3=%str1%%str2%"
set "str4=Media"
set "str5=%str1%%str4%"
echo Starting... 
IF EXIST %str3% (  
 IF NOT EXIST %str5% (
  mkdir Media
  echo defaultSlideDuration = 10 > Media/_config.txt
  node pres_service.js --add
  pause
 )else (
  echo defaultSlideDuration = 10 > Media/_config.txt
  node pres_service.js --add
  pause
 )
) ELSE (
 npm install
 IF NOT EXIST %str5% (
  mkdir Media
  echo defaultSlideDuration = 10 > Media/_config.txt
  node pres_service.js --add
  pause
 )else (
  echo defaultSlideDuration = 10 > Media/_config.txt
  node pres_service.js --add
  pause
 )
)









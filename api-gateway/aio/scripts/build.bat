@echo off
setlocal

rem set GOPATH=%cd%

rem echo "Install Package..."
rem go get github.com/gorilla/mux
rem go get github.com/streadway/amqp
rem go get golang.org/x/net/icmp
rem go get golang.org/x/net/ipv4
rem go get golang.org/x/net/ipv6

rem set GOPATH=%cd%\..\..
rem echo "GOPATH=%GOPATH%"

rem echo "Install govendor..."
rem go get -u github.com/kardianos/govendor

rem echo "Download vendor pkg..."
rem govendor sync

echo "Build..."
set /P VERSION=<VERSION
rem echo %VERSION%

set rev_cmd=git rev-parse HEAD
FOR /F "tokens=*" %%F IN ('%rev_cmd%') DO (
SET REVISION=%%F
)
rem echo %REVISION%

set HOUR=%time:~0,02%
set MINUTE=%time:~3,2%
set SECOND=%time:~6,2%

set HH1=%HOUR:~0,1%
set HH2=%HOUR:~1,1%
if "%HH1%" == " " set HOUR=0%HH2%

set BUILDTIME=%date%T%HOUR%:%MINUTE%:%SECOND%
rem echo %BUILDTIME%

go build -ldflags "-X=main.Version=%VERSION%(Windows) -X=main.BuildTime=%BUILDTIME% -X=main.Revision=%REVISION%" -o api-gateway.exe

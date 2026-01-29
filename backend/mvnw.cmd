@REM Simplified Maven Wrapper for Windows
@echo off
setlocal

set "MVN_VERSION=3.9.6"
set "MVN_DIR=%~dp0.maven"
set "MVN_ZIP=%temp%\maven-%MVN_VERSION%.zip"
set "MVN_URL=https://archive.apache.org/dist/maven/maven-3/%MVN_VERSION%/binaries/apache-maven-%MVN_VERSION%-bin.zip"

if not exist "%MVN_DIR%\apache-maven-%MVN_VERSION%" (
    echo Maven not found. Downloading Maven %MVN_VERSION%...
    powershell -Command "Invoke-WebRequest -Uri '%MVN_URL%' -OutFile '%MVN_ZIP%'"
    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MVN_ZIP%' -DestinationPath '%MVN_DIR%'"
    del "%MVN_ZIP%"
)

set "M2_HOME=%MVN_DIR%\apache-maven-%MVN_VERSION%"
set "PATH=%M2_HOME%\bin;%PATH%"

echo Running Maven...
mvn %*

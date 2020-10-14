#!/bin/bash

echo "Build..."
VERSION=$(cat ./VERSION_BROKER)
REVISION=`git rev-parse HEAD`
BUILD_TIME=`date --iso=seconds`

go build -ldflags "-X=main.Version=$VERSION -X=main.BuildTime=$BUILD_TIME -X=main.Revision=$REVISION" -o ce-broker

#!/bin/sh

SETTINGS_FILE=config/ce-api-gateway.yaml
PORT=7000

REPO=markruler
# REPO_PORT=":5000"
REPO_PORT=""
IMAGE=ce-api-gateway
VERSION=$(cat ./VERSION)\

docker build --build-arg EXPOSE_PORT=$PORT -t $IMAGE:$VERSION -f ./aio/Dockerfile .
docker tag $IMAGE:$VERSION $REPO$REPO_PORT/$IMAGE:$VERSION
# docker push $REPO$REPO_PORT/$IMAGE:$VERSION

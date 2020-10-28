#!/bin/sh

SETTINGS_FILE=config/service-bus.yaml
PORT=7000

REPO=markruler
# REPO_PORT=":5000"
REPO_PORT=""
IMAGE=service-bus
VERSION=$(cat ./VERSION)\

if [ -f $SETTINGS_FILE ];then
	while read LINE; do
		if [[ "$(awk '{print $1}' <<<"$LINE")" == 'svcbus.server.port:' ]]; then
			PORT="$(awk '{print $2}' <<<"$LINE")"
			#echo $PORT
		else
			continue
		fi
	done < $SETTINGS_FILE
fi

docker build --build-arg EXPOSE_PORT=$PORT -t $IMAGE:$VERSION -f ./Dockerfile .
docker tag $IMAGE:$VERSION $REPO$REPO_PORT/$IMAGE:$VERSION
# docker push $REPO$REPO_PORT/$IMAGE:$VERSION

#!/usr/bin/env bash

BINARY="api-gateway"
IMAGE="api-gateway"
VERSION="0.1.0"
REGISTRY="local-registry"
REGISTRY_PORT=":5000"

remove::docker_images() {
	image_hash=$(docker images | grep $BINARY | awk '{print $3}')
	if [ -z "$image_hash" ]; then
		echo "\$image_hash is NULL"
	else
		echo "\$image_hash is NOT NULL"
		docker rmi -f $image_hash
	fi
}

remove::docker_images
docker build --build-arg JAR_FILE=build/libs/*.jar -t $IMAGE:$VERSION -f ./aio/Dockerfile .
docker tag $IMAGE:$VERSION $REGISTRY$REGISTRY_PORT/$IMAGE:$VERSION
docker tag $IMAGE:$VERSION $REGISTRY$REGISTRY_PORT/$IMAGE:latest

echo -e "\n>>> PRINT IMAGES <<<"
echo "$(docker images | grep $BINARY | awk '{ printf ("%s\n", $0) }')"

docker push $REGISTRY$REGISTRY_PORT/$IMAGE:$VERSION

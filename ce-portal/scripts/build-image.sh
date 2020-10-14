#! /bin/bash

REPOSITORY="ce-registry"
PORT="5000"
IMAGE_NAME="ce-portal"
DEL_VERSION="0.1.0"
VERSION="0.2.0"

echo "pwd :"`pwd`

docker rmi --force $IMAGE_NAME $IMAGE_NAME:latest $IMAGE_NAME:$DEL_VERSION $REPOSITORY:$PORT/$IMAGE_NAME:$DEL_VERSION
docker build --file ./Dockerfile . --tag $IMAGE_NAME:latest --tag $IMAGE_NAME:$VERSION --no-cache
docker tag $IMAGE_NAME:$VERSION $REPOSITORY:$PORT/$IMAGE_NAME:$VERSION
docker push $REPOSITORY:$PORT/$IMAGE_NAME:$VERSION

echo "EXIT"

exit 0
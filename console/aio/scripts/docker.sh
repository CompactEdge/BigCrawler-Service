#!/usr/bin/env bash

remove::docker_images() {
	image_hash=$(docker images | grep $IMAGE | awk '{print $3}')
	if [ -z "$image_hash" ]; then
		echo "\$image_hash is NULL"
	else
		echo "\$image_hash is NOT NULL"
		docker rmi -f $image_hash
	fi
}

IMAGE="console"

# remove old images
remove::docker_images

echo "Build with React.js"
yarn build
echo "Build Complete"

# build docker image
REPO="markruler"
REPO_PORT=""
VERSION=$(node -p "require('./package.json').version")

echo $VERSION

docker build -t $IMAGE:$VERSION -f ./aio/Dockerfile .
docker tag $IMAGE:$VERSION $REPO$REPO_PORT/$IMAGE:$VERSION
docker tag $IMAGE:$VERSION $REPO$REPO_PORT/$IMAGE:latest
docker push $REPO$REPO_PORT/$IMAGE

echo -e "\n>>> PRINT IMAGES <<<"
echo "$(docker images | grep $IMAGE | awk '{ printf ("%s\n", $0) }')"

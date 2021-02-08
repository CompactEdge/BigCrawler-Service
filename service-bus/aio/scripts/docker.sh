#!/usr/bin/env bash

REGISTRY_HOST="localhost"
REGISTRY_PORT=":5000"
VERSION=$(cat ./VERSION)

remove::docker_images() {
	image_hash=$(docker images | grep $IMAGE | awk '{print $3}')
	if [ -z "$image_hash" ]; then
		echo "\$image_hash is NULL"
	else
		echo "\$image_hash is NOT NULL"
		docker rmi -f $image_hash
	fi
}

parse::yaml() {
	local prefix=$2
	local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @ | tr @ '\034')
	sed -ne "s|^\($s\):|\1|" \
		-e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
		-e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p" $1 |
		awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
				vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
				printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
		}'
}

IMAGE="service-bus"

# remove old images
remove::docker_images

SETTINGS_FILE="aio/chart/files/service-bus.yaml"
eval $(parse::yaml $SETTINGS_FILE "config_")

BINARY=svcbus
# check if file exists
if [ -e $BINARY ]; then
	echo "Binary File Exists"
	echo "Remove it"
	rm -f $BINARY
else
	echo "Not Found $BINARY"
fi

echo "Build $BINARY"
make build
echo "Build Complete"

# build docker image
docker build --build-arg EXPOSE_PORT=$config_svcbus_server_port -t $IMAGE:$VERSION -f ./aio/Dockerfile.prod .
docker tag $IMAGE:$VERSION $REGISTRY_HOST$REGISTRY_PORT/$IMAGE:$VERSION
docker tag $IMAGE:$VERSION $REGISTRY_HOST$REGISTRY_PORT/$IMAGE:latest
docker push $REGISTRY_HOST$REGISTRY_PORT/$IMAGE:$VERSION

echo -e "\n>>> PRINT IMAGES <<<"
echo "$(docker images | grep $IMAGE | awk '{ printf ("%s\n", $0) }')"

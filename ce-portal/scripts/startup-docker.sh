#! /bin/bash

# mariadb docker container
docker run \
--name mariadb \
-p 3306:3306 \
--restart=always \
-v $HOME/ce-portal/devops/helm/mariadb/files/docker-entrypoint-initdb.d/user.sql:/docker-entrypoint-initdb.d/user.sql \
-e MYSQL_ROOT_PASSWORD=testmaria \
-d \
mariadb:10.3.23-bionic

echo "EXIT"
exit 0

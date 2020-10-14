#!/bin/bash

# # minikube
minikube start \
--kubernetes-version=v1.18.0 \
--driver=hyperkit \
--container-runtime=docker \
--memory='3gb'

# mariadb
docker run \
--name mariadb \
-p 3306:3306 \
--restart=always \
-e MYSQL_ROOT_PASSWORD=testmaria \
-d \
mariadb:10.3.23-bionic

# rabbitmq
docker run \
--name rabbitmq \
-p 5672:5672 \
--restart=always \
-e RABBITMQ_DEFAULT_USER=mec1 \
-e RABBITMQ_DEFAULT_PASS='!mecuser1' \
-d \
rabbitmq:3.8.7-alpine

# # prometheus
# kubectl create -f devops/k8s/coreos/kube-prometheus/manifests/setup
# kubectl create -f devops/k8s/coreos/kube-prometheus/manifests
# # kubectl delete -f devops/k8s/coreos/kube-prometheus/manifests
# # kubectl delete -f devops/k8s/coreos/kube-prometheus/manifests/setup

# nohup kubectl port-forward --address 0.0.0.0 svc/grafana 3000:3000 -n monitoring > grafana.log < /dev/null &
# nohup kubectl port-forward --address 0.0.0.0 svc/prometheus-k8s 9090:9090 -n monitoring > prometheus.log < /dev/null &

# make deps
# make dev
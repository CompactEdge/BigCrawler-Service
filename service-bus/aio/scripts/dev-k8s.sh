#!/bin/bash

minikube start \
--kubernetes-version=v1.16.0 \
--driver=hyperkit \
--container-runtime=docker \
--memory='3gb'

docker run \
--detach \
--rm \
--publish 5000:5000 \
--name registry \
registry:2.7.1

# prometheus
kubectl create -f devops/k8s/coreos/kube-prometheus/manifests/setup
kubectl create -f devops/k8s/coreos/kube-prometheus/manifests
# kubectl delete -f devops/k8s/coreos/kube-prometheus/manifests
# kubectl delete -f devops/k8s/coreos/kube-prometheus/manifests/setup

kubectl create namespace gigamec-mano

# mariadb
helm upgrade --install mariadb devops/helm/mariadb -n gigamec-mano

# rabbitmq
helm upgrade --install rabbitmq devops/helm/rabbitmq -n gigamec-mano
# helm uninstall rabbitmq -n gigamec-mano
# kubectl logs -f rabbitmq-0 -n gigamec-mano

nohup kubectl port-forward --address 0.0.0.0 svc/prometheus-k8s 9090:9090 -n monitoring > prometheus.log < /dev/null &
nohup kubectl port-forward --address 0.0.0.0 svc/grafana 3000:3000 -n monitoring > grafana.log < /dev/null &
nohup kubectl port-forward --address 0.0.0.0 svc/rabbitmq 5672:5672 15672:15672 -n gigamec-mano > rabbitmq.log < /dev/null &

make deps
make dev

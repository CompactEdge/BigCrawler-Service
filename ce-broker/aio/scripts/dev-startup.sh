#!/bin/bash

minikube start \
--kubernetes-version=v1.18.0 \
--driver=hyperkit \
--container-runtime=docker \
--memory='2gb'

# kubectl create -f devops/k8s/coreos/kube-prometheus/manifests/setup
# kubectl create -f devops/k8s/coreos/kube-prometheus/manifests
# kubectl delete -f devops/k8s/coreos/kube-prometheus/manifests
# kubectl delete -f devops/k8s/coreos/kube-prometheus/manifests/setup

# kubectl create namespace ce-mano
# helm upgrade --install rabbitmq devops/helm/rabbitmq -n ce-mano
# helm uninstall rabbitmq -n ce-mano
# kubectl logs -f rabbitmq-0 -n ce-mano

# nohup kubectl port-forward --address 0.0.0.0 svc/rabbitmq 5672:5672 15672:15672 -n ce-mano > rabbitmq.log < /dev/null &
# nohup kubectl port-forward --address 0.0.0.0 svc/grafana 3000:3000 -n monitoring > grafana.log < /dev/null &
# nohup kubectl port-forward --address 0.0.0.0 svc/prometheus-k8s 9090:9090 -n monitoring > prometheus.log < /dev/null &

make deps
make dev

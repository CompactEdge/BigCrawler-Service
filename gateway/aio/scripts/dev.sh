#!/bin/bash

# Run Minikube
minikube start
eval $(minikube docker-env)

# Run Prometheus
./aio/scripts/prometheus.sh

# Run Service Bus
cd ../service-bus
make dev

# Run API Gateway
gradle bootRunDev

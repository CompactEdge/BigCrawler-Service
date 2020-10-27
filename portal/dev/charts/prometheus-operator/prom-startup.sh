#!/bin/bash

kubectl create ns monitor
# kubectl get crds -n monitor

# crds를 별도로 생성할 경우
# kubectl create --save-config -f ./prometheus-operator/crds/
# kubectl delete -f ./prometheus-operator/crds/
# => templates/*/crds.yaml
# helm upgrade --install --dry-run --debug prom ./prometheus-operator --set prometheusOperator.createCustomResource=false -n monitor

# 한번에 설치할 경우
# default는 문제 없음
# helm upgrade --install prom .
# kubectl get crds

# 네임스페이스 지정 시 에러. => crd를 먼저 삭제하고 시작
kubectl delete crd alertmanagers.monitoring.coreos.com
kubectl delete crd podmonitors.monitoring.coreos.com
kubectl delete crd prometheuses.monitoring.coreos.com
kubectl delete crd prometheusrules.monitoring.coreos.com
kubectl delete crd servicemonitors.monitoring.coreos.com
kubectl delete crd thanosrulers.monitoring.coreos.com
# helm install prom . -n monitor --skip-crds --no-hooks --render-subchart-notes --reuse-values
helm upgrade --install prom . -n monitor --skip-crds --no-hooks
# rendered manifests contain a resource that already exists.
# Unable to continue with install:
# existing resource conflict: namespace: , name: alertmanagers.monitoring.coreos.com,
# existing_kind: apiextensions.k8s.io/v1beta1, Kind=CustomResourceDefinition,
# new_kind: apiextensions.k8s.io/v1beta1, Kind=CustomResourceDefinition
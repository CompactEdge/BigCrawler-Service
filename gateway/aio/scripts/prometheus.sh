#!/bin/bash

# crds를 먼저 생성
# 그렇지 않으면 리소스를 찾지 못함
kubectl create --save-config -f ./prometheus-operator/crds/
# kubectl get crds

# kubectl delete -f ./prometheus-operator/crds/
# 네임스페이스 지정 시 에러. => crd를 먼저 삭제하고 시작
# kubectl delete crd alertmanagers.monitoring.coreos.com
# kubectl delete crd podmonitors.monitoring.coreos.com
# kubectl delete crd prometheuses.monitoring.coreos.com
# kubectl delete crd prometheusrules.monitoring.coreos.com
# kubectl delete crd servicemonitors.monitoring.coreos.com
# kubectl delete crd thanosrulers.monitoring.coreos.com

helm install prometheus prometheus-operator
# helm install prom . --skip-crds --no-hooks --render-subchart-notes --reuse-values
# helm upgrade --install prom . --skip-crds --no-hooks
# helm upgrade --install --dry-run --debug prom ./prometheus-operator --set prometheusOperator.createCustomResource=false

# Error 1
# rendered manifests contain a resource that already exists.
# Unable to continue with install:
# existing resource conflict: namespace: , name: alertmanagers.monitoring.coreos.com,
# existing_kind: apiextensions.k8s.io/v1beta1, Kind=CustomResourceDefinition,
# new_kind: apiextensions.k8s.io/v1beta1, Kind=CustomResourceDefinition

# Error 2
# Error: rendered manifests contain a resource that already exists.
# Unable to continue with install:
# could not get information about the resource: Get https://192.168.64.62:8443/apis/monitoring.coreos.com/v1/namespaces/monitor/alertmanagers/prom-prometheus-operator-alertmanager:
# stream error: stream ID 245; INTERNAL_ERRO

PID=`ps -eaf | grep 'kubectl port-forward' | grep -v grep | awk '{print $2}'`
if [[ "" !=  "$PID" ]]; then
  echo "killing $PID"
    kill -9 $PID
fi

nohup kubectl port-forward --address 0.0.0.0 svc/prometheus-grafana 3030:80 -n default > grafana.log < /dev/null &
# kubectl get secret --namespace default prometheus-grafana -o jsonpath="{.data.admin-user}" | base64 --decode ; echo
# kubectl get secret --namespace default prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
nohup kubectl port-forward --address 0.0.0.0 svc/prometheus-prometheus-oper-prometheus 9090:9090 -n default > prometheus.log < /dev/null &

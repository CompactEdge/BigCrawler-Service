#! /bin/bash

## Exit on any error.
# set -e

LOCAL_PATH=$(echo $PATH | grep -c /usr/local/bin)
MARIA="maria"
PORTAL="portal"
NAMESPACE="gigamec-mano"
HELM_MARIA=$(helm ls -n $NAMESPACE | grep -c $MARIA)

echo $PATH

## helm, kubectl
if [ $LOCAL_PATH -eq 0 ]
  then
    export PATH=$PATH:/usr/local/bin
  # break
fi

echo $PATH

# echo -e "\n\n>>>>>> DEBUG mano-portal helm file <<<<<<"
# helm install debug ./op-dev/helm/mano-portal --dry-run --debug

eval $(minikube docker-env)
KUBE_NS=$(kubectl get namespace | grep $NAMESPACE -c)
if [ $KUBE_NS -eq 0 ]
  then
    kubectl create namespace $NAMESPACE
fi

echo "pwd :"`pwd`
echo "Running Maria :" $READY_MARIA
if [ $HELM_MARIA -eq 0 ]
  then
    echo -e "\n\n>>>>>> install Maria DB <<<<<<"
    helm install $MARIA $PWD/op-dev/helm/mariadb --namespace $NAMESPACE
    while [ 1 ]
    do
      KUBE_MARIA=$(kubectl get po -n $NAMESPACE | grep $MARIA | grep -c 1/1)
      echo "Maria is ready : " $KUBE_MARIA
      if [ $KUBE_MARIA -gt 0 ]
      then
        break
      fi
      sleep 10
    done
  else
    kubectl get po --namespace $NAMESPACE | grep $MARIA | grep 1/1
fi

## MariaDB가 완전히 Running 되기 전 어플리케이션을 실행하면 Connection Error가 발생하고
## 이후 어플리케이션이 다시 실행되어서 DB에 연결하면 hibernate가 테이블명을 자동으로 snake_case로 생성
echo -e "\n\n>>>>>> install MANO-Portal Project <<<<<<"
helm install $PORTAL $PWD/op-dev/helm/mano-portal --namespace $NAMESPACE

echo -e "\n\n>>>>>> show running pods <<<<<<"
kubectl get po --namespace $NAMESPACE

echo "EXIT"
exit 0
## Linux, Mac OS X
## chmod +x ./build-kube.sh
## ./build-kube.sh

# CE Service Bus

## Development

```bash
# On CentOS 7
wget https://dl.google.com/go/go1.15.linux-amd64.tar.gz
sha256sum go1.15.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.15.linux-amd64.tar.gz

go version
> go version go1.15 linux/amd64
go env
> GOPATH="${HOME}/go"
> GOROOT="/usr/local/go"
pwd
> ${GOPATH}/src/github.com/ceWizOnTech/service-bus

```

## Build

```bash
# Cross-Compiling for Linux
make build
```

## Run

```bash
make dev
```

## Helm

```bash
helm install service-bus ./chart
```

## Swagger API

> http://{HOST}/docs/index.html

```bash
make docs
```

- swaggo 주석에서 param_type을 body, data_type을 k8s.io/api의 구조체로 지정하면 아래와 같이 출력된다.
그래서 body string으로 지정 후 json이나 yaml 형식을 입력한다.

```json
{
  "annotations": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "apiVersion": "string",
  "clusterName": "string",
  "creationTimestamp": "string",
  "deletionGracePeriodSeconds": 0,
  "deletionTimestamp": "string",
  "finalizers": [
    "string"
  ],
  "generateName": "string",
  "generation": 0,
  "kind": "string",
  "labels": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "managedFields": [
    {
      "apiVersion": "string",
      "fieldsType": "string",
      "fieldsV1": {},
      "manager": "string",
      "operation": "string",
      "time": "string"
    }
  ],
  "name": "string",
  "namespace": "string",
  "ownerReferences": [
    {
      "apiVersion": "string",
      "blockOwnerDeletion": true,
      "controller": true,
      "kind": "string",
      "name": "string",
      "uid": "string"
    }
  ],
  "resourceVersion": "string",
  "selfLink": "string",
  "spec": {
    "finalizers": [
      "string"
    ]
  },
  "status": {
    "conditions": [
      {
        "lastTransitionTime": "string",
        "message": "string",
        "reason": "string",
        "status": "string",
        "type": "string"
      }
    ],
    "phase": "string"
  },
  "uid": "string"
}
```

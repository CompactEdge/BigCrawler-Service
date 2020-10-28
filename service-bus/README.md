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
make build
```

## Run

```bash
./service-bus
```

## Helm

```bash
helm install service-bus ./chart
```

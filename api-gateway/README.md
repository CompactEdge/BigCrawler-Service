# Compact Edge - API Gateway


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
> ${GOPATH}/src/ce-api-gateway
```

## Build

```bash
make build
```

## Run

```bash
./ce-api-gateway
```

## Helm

```bash
helm install ce-api-gateway ./chart
```

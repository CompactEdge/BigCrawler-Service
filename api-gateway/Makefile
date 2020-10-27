BINARY := apigw

.PHONY: fmt
fmt:
	go fmt ./...

.PHONY: deps
deps:
	@go get -t -d -v ./...
	@go get -u
	@go mod tidy
	@go mod vendor

.PHONY: docker
docker:
	./aio/scripts/docker.sh

.PHONY: build
build:
	@GOOS=linux GOARCH=amd64 go build -o ${BINARY} main.go

.PHONY: dev
dev:
	go run main.go -profile="dev" -debug

.PHONY: server
server:
	@go run main.go -profile="server"

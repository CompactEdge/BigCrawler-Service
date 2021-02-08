BINARY := svcbus
GO_OS := $(shell go env GOOS)
GOARCH := $(shell go env GOARCH)

.PHONY: fmt
fmt:
	go fmt ./...

.PHONY: deps
deps:
	# go get -u
	@go get -t -d -v ./...
	@go mod tidy
	@go mod vendor

.PHONY: docker
docker:
	./aio/scripts/docker.sh

.PHONY: docs
docs:
	# swag init --parseDependency --parseInternal --generalInfo="main.go" --dir="./"
	swag init

.PHONY: clean
clean:
	@rm -rf ${BINARY} docs

.PHONY: build
build: clean docs
	@echo "GO_OS:   ${GO_OS}"
	@echo "GO_ARCH: ${GOARCH}"
	@#CGO_ENABLED=0 GOOS=${GO_OS} GOARCH=${GO_ARCH} go build -o ${BINARY} main.go
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ${BINARY} main.go

.PHONY: run
run:
	go run main.go -profile="dev" -debug

.PHONY: server
server:
	@go run main.go -profile="server"

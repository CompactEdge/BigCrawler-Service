BINARY := ce-vim

fmt:
	go fmt ./...
.PHONY: fmt

deps:
	# go get -u
	go get -t -d -v ./...
	go mod tidy
	go mod vendor
.PHONY: deps

docker:
	./scripts/docker.sh
.PHONY: docker

build:
	@go build -o ${BINARY} main.go
.PHONY: build

dev:
	go run main.go
.PHONY: run

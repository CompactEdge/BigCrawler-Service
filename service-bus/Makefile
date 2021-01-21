BINARY := svcbus

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
build:
	@GOOS=linux GOARCH=amd64 go build -o ${BINARY} main.go

.PHONY: run
run:
	go run main.go -profile="dev" -debug

.PHONY: server
server:
	@go run main.go -profile="server"

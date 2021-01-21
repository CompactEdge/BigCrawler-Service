VERSION := 0.1.0

.PHONY: build
build:
	@gradle clean build

.PHONY: build-skip-test
build-skip-test:
	@gradle clean build -x test

.PHONY: docker
docker:
	./aio/scripts/docker.sh

.PHONY: run
run:
  # gradle bootRun --args='--spring.profiles.active=dev'
	@gradle bootRunDev

.PHONY: jar
jar:
	@java -jar -Dspring.profiles.active=dev build/libs/gateway-${VERSION}.jar

.PHONY: deps
deps:
	@gradle dependencies

.PHONY: test
test:
	@gradle test

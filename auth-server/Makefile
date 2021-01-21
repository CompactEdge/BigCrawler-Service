NAME := auth-server

.PHONY: docker
docker:
	./aio/scripts/docker.sh

# gradle tasks
.PHONY: deps
deps:
	@gradle dependencies
	@#gradle buildEnvironment

.PHONY: prop
prop:
	@gradle properties

.PHONY: test
test:
	@gradle test

.PHONY: build
build:
	@gradle clean build -x test

.PHONY: build-with-test
build-with-test:
	@gradle clean build

.PHONY: run
run:
	@gradle bootRun --args='--spring.profiles.active=dev'

.PHONY: binrun
binrun:
	@java -jar -Dspring.profiles.active=dev ./build/libs/${NAME}-*.jar

FROM golang:1.15.0-alpine3.12

ARG EXPOSE_PORT

WORKDIR /root/ce-service-bus

ADD config /root/ce-service-bus/config
ADD pkg /root/ce-service-bus/pkg
ADD main.go /root/ce-service-bus/
ADD go.mod /root/ce-service-bus/

# RUN ["go", "mod", "vendor"]
# RUN ["go", "build", "-o", "ce-service-bus", "main.go"]
# RUN ["rm", "-rf", "vendor", "pkg", "main.go", "go.mod", "go.sum"]

EXPOSE $EXPOSE_PORT

# CMD ["sleep", "1000000000"]
ENTRYPOINT ["./svcbus"]
# FROM golang:1.15.0-alpine3.12
FROM alpine:3.12.1
ARG EXPOSE_PORT
WORKDIR /root/service-bus
# COPY
ADD config/service-bus.yaml /conf/
ADD svcbus /root/service-bus/
EXPOSE $EXPOSE_PORT

# CMD ["sleep", "1000000000"]
ENTRYPOINT ["./svcbus", "-profile=dev", "-debug"]
# ENTRYPOINT ["./svcbus", "-profile=server"]

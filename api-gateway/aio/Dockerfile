# FROM golang:1.15.0-alpine3.12
FROM alpine:3.12.1
ARG EXPOSE_PORT
WORKDIR /root/api-gateway
# COPY
ADD config/api-gateway.yaml /conf/
ADD apigw /root/api-gateway/
EXPOSE $EXPOSE_PORT
# CMD ["sleep", "1000000000"]
ENTRYPOINT ["./apigw", "-profile=server"]

FROM golang:1.15.0-alpine3.12

ARG EXPOSE_PORT

WORKDIR /root/ce-api-gateway

# COPY
ADD ce-api-gateway /root/ce-api-gateway/
ADD config/ce-api-gateway.yaml /conf/

EXPOSE $EXPOSE_PORT

# CMD ["sleep", "1000000000"]
ENTRYPOINT ["./apigw", "-profile=server"]
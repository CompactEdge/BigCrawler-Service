FROM golang:1.15.0-alpine3.12

ARG EXPOSE_PORT

WORKDIR /root/ce-broker

# COPY
ADD ce-broker /root/ce-broker/
ADD config/ce-broker.yaml /conf/

EXPOSE $EXPOSE_PORT

# CMD ["sleep", "1000000000"]
ENTRYPOINT ["./ce-broker", "-profile=server"]
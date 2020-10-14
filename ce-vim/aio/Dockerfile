FROM golang:1.15.0-alpine3.12

ARG EXPOSE_PORT

WORKDIR /root/ce-vim

ADD config /root/ce-vim/config
ADD pkg /root/ce-vim/pkg
ADD main.go /root/ce-vim/
ADD go.mod /root/ce-vim/

# RUN ["go", "mod", "vendor"]
# RUN ["go", "build", "-o", "ce-vim", "main.go"]
# RUN ["rm", "-rf", "vendor", "pkg", "main.go", "go.mod", "go.sum"]

EXPOSE $EXPOSE_PORT

# CMD ["sleep", "1000000000"]
ENTRYPOINT ["./mec-vim"]
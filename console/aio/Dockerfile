FROM nginx:1.16.0-alpine
COPY ./build /usr/share/nginx/html
COPY ./aio/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]

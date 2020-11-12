FROM openjdk:11-jre-slim
ARG JAR_FILE
COPY $JAR_FILE app.jar
# RUN [ "apt-get", "update" ]
# RUN [ "apt-get", "install", "-y", "dnsutils" ]
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=server", "-Dspring.config.location=file:/etc/apigw/bootstrap.yml", "/app.jar" ]

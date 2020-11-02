FROM openjdk:11-jre-slim
ARG JAR_FILE
COPY $JAR_FILE app.jar
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=server", "-Dspring.config.location=file:/conf/application.yml", "/app.jar" ]

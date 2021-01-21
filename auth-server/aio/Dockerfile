FROM openjdk:11.0.9
ARG JAR_FILE
COPY $JAR_FILE app.jar
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=prod", "-Dspring.config.location=file:/application.yaml", "/app.jar" ]

# mvn clean package -Dmaven.test.skip=true
# docker build -f . -t markruler/ce-portal:0.1.0
# docker push markruler/ce-portal:0.1.0

FROM maven:3.6-jdk-8

# ENV REMOVE_SHELL_HOST 192.168.7.221 => chart
# CMD echo $REMOVE_SHELL_HOST

VOLUME /tmp

WORKDIR /root/ce-portal

# Remove *.jar in .dockerignore
# ADD portal-*.jar /root/ce-portal/portal.jar
COPY portal-*.jar /root/ce-portal/portal.jar

RUN ["pwd"]
RUN ["ls", "/root/ce-portal"]
RUN ["ls", "-ltrh", "/root/ce-portal/portal.jar"]

# EXPOSE 10080

# application.yml -> k8s configmap
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=server", "-Dspring.config.location=file:/root/conf/application.yml", "/root/ce-portal/portal.jar" ]

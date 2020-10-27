# mvn clean package -Dmaven.test.skip=true
# docker build -f . -t markruler/mano-portal:0.0.7
# docker push markruler/mano-portal:0.0.7

FROM maven:3.6-jdk-8

# ENV REMOVE_SHELL_HOST 192.168.7.221 => chart
# CMD echo $REMOVE_SHELL_HOST

VOLUME /tmp

WORKDIR /root/mano-portal

# Remove *.jar in .dockerignore
# ADD manoportal-*.jar /root/mano-portal/manoportal.jar
COPY manoportal-*.jar /root/mano-portal/manoportal.jar

RUN ["pwd"]
RUN ["ls", "/root/mano-portal"]
RUN ["ls", "-ltrh", "/root/mano-portal/manoportal.jar"]

# EXPOSE 10080

# application.yml -> k8s configmap
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=server", "-Dspring.config.location=file:/root/conf/application.yml", "/root/mano-portal/manoportal.jar" ]

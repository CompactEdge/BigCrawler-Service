# API Gateway

## CentOS 7

```bash
yum install -y java-11-openjdk
java -version
wget https://services.gradle.org/distributions/gradle-6.8-bin.zip -O /tmp/gradle-6.8.zip
mkdir -p /opt/gradle
unzip -d /opt/gradle /tmp/gradle-6.8.zip
ls /opt/gradle/gradle-6.8
export PATH=$PATH:/opt/gradle/gradle-6.8/bin
```

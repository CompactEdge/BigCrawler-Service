# Compact Edge - Portal

## Dependencies

### Required

- [Maria DB 10.3.x](https://mariadb.org/)
- [Maven 3.6.x](https://maven.apache.org/)

### Optional

- [Istio (Kiali)](https://istio.io/)
- [Prometheus 2.x](https://prometheus.io/)
- [kube-ops-view](https://codeberg.org/hjacobs/kube-ops-view)

## Development

```bash
# Install js package
npm i -D

# Bundle
./scripts/webpack.sh

# Run
mvn spring-boot:run -D spring-boot.run.profiles=dev-docker -D spring.config.location=file:application.yml
```

# Authorization Server

```bash
docker run \
-d \
--rm \
--name keycloak \
-p 9000:8080 \
-e KEYCLOAK_USER=admin \
-e KEYCLOAK_PASSWORD=1234 \
-e KEYCLOAK_LOGLEVEL=DEBUG \
-e ROOT_LOGLEVEL=DEBUG \
jboss/keycloak:12.0.2
```

# Authorization Server

## Docs

- https://www.keycloak.org/docs/12.0/authorization_services/

## up and down

```bash
make run
```

```bash
make clean
```

## W/O docker-compose

```bash
docker run \
-d \
--rm \
--name identity-provider \
-p 9000:8080 \
-e KEYCLOAK_USER=admin \
-e KEYCLOAK_PASSWORD=1234 \
-e KEYCLOAK_LOGLEVEL=DEBUG \
-e ROOT_LOGLEVEL=DEBUG \
-v $(pwd)/tmp:/tmp \
jboss/keycloak:12.0.2
```

```bash
docker exec -it identity-provider \
standalone.sh -Dkeycloak.profile.feature.upload_scripts=enabled

-e KEYCLOAK_IMPORT=/tmp/realm/realm-export.json
```

```bash
docker logs -f identity-provider
curl localhost:9000
```

> 화면에서 직접 export/import 하는 것을 추천합니다.

## Exporting Realm

```bash
docker exec -it identity-provider \
/opt/jboss/keycloak/bin/standalone.sh \
-Djboss.socket.binding.port-offset=100 \
-Dkeycloak.migration.action=export \
-Dkeycloak.migration.provider=singleFile \
-Dkeycloak.migration.realmName=master \
-Dkeycloak.migration.usersExportStrategy=REALM_FILE \
-Dkeycloak.migration.file=/tmp/realm/realm-export-$(date +'%s').json
```

```bash
docker rm -f identity-provider
```

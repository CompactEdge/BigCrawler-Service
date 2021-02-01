# Authorization Server

## Start Up

```bash
docker run \
-d \
--rm \
--name identity-provider \
-p 9000:8080 \
-e KEYCLOAK_USER=admin \
-e KEYCLOAK_PASSWORD=1234 \
-e KEYCLOAK_LOGLEVEL=DEBUG \
-e KEYCLOAK_IMPORT=$PWD/ce-realm.json
-e ROOT_LOGLEVEL=DEBUG \
jboss/keycloak:12.0.2
```

## Exporting Realm

```bash
docker exec -it identity-provider /opt/jboss/keycloak/bin/standalone.sh \
-Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export \
-Dkeycloak.migration.provider=singleFile \
-Dkeycloak.migration.realmName=my_realm \
-Dkeycloak.migration.usersExportStrategy=REALM_FILE \
-Dkeycloak.migration.file=/tmp/my_realm.json
```
# Authorization Server

## Docs

- https://www.keycloak.org/docs/12.0/authorization_services/

## Helm

```bash
# /etc/kubernetes/manifests/kube-apiserver.yaml
# --service-node-port-range=10000-19999 # nodePort: When changed, automatically restart.
helm install iam aio/chart/keycloak
```

- [CodeCentric - Keycloak](https://chartcenter.io/stable/keycloak)

```bash
helm repo add codecentric https://codecentric.github.io/helm-charts
helm repo list
helm repo update
helm pull codecentric/keycloak --untar
```

- `keycloak/charts/postgresql/values.yaml`
> Warning  FailedScheduling  3m48s (x1759 over 43h)  default-scheduler  0/1 nodes are available: 1 pod has unbound immediate PersistentVolumeClaims.

```diff
## PostgreSQL data Persistent Volume Storage Class
## If defined, storageClassName: <storageClass>
## If set to "-", storageClassName: "", which disables dynamic provisioning
## If undefined (the default) or set to null, no storageClassName spec is
##   set, choosing the default provisioner.  (gp2 on AWS, standard on
##   GKE, AWS & OpenStack)
##
persistence:
  # ...
-  storageClass: "-"
+  storageClass: "nfs-provisioner"

# Additional environment variables for Keycloak
- extraEnv: ""
+ extraEnv: |
+   - name: KEYCLOAK_USER
+     value: wizontech
+   - name: KEYCLOAK_PASSWORD
+     value: admin
```

## docker-compose up and down

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

## PostgreSQL

```bash
psql -U keycloak -h localhost
```

```bash
\h
# Available help:
# ...
\h table

\l
\l+
# List of databases
# ...

\d
# List of relations
#  Schema |             Name              | Type  |  Owner
# --------+-------------------------------+-------+----------
#  public | admin_event_entity            | table | keycloak

\d+ admin_event_entity
# Table "public.admin_event_entity"
# ...

\du
# List of roles
# ...

\q
# quit
```

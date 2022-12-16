import time
from datetime import datetime, timedelta

from app.model import CONDITION_READY, PHASE_RUNNING, PHASE_TERMINATING
from flask import current_app
from kubernetes import client, config
from kubernetes.client.exceptions import ApiException
from utils import format_datetime
from utils.logger import Log

WEBSERVER_NAME = "service"
WEBSERVER_PORT = "8080"
SLEEP_TIME = 3

def load_k8s_config():
    config.load_kube_config(config_file=current_app.config['CONFIG_FILE'])

# 전체 node 리스트 조회
def list_node():
    node_list = list()
    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        res = core_v1.list_node()
        if res is not None:
            for node in res.items:
                if node.metadata.managed_fields[0].manager != 'kube-apiserver' and node.status.conditions[4].status == "True":
                    data = dict()

                    data['name'] = node.metadata.name
                    data['crt_time'] = format_datetime(node.metadata.creation_timestamp)
                    if('node-role.kubernetes.io/master' in node.metadata.labels):
                        data['node_role'] = 'master'
                    else:
                        data['node_role'] = 'worker'    

                    node_list.append(data)            
        else:
            Log.info("fail to list node")
            
    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    return node_list


# 전체 namespace 조회
def list_namespace():
    all_namespace_list = list()

    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        res = core_v1.list_namespace()
        if res is not None:
            for item in res.items:
                data = dict()
                data['name'] = item.metadata.name
                data['crt_time'] = format_datetime(item.metadata.creation_timestamp)
                all_namespace_list.append(data)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    return all_namespace_list

# system 제외 namespace 조회
def list_namespace_except_system():
    namespace_list = list()
    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        res = core_v1.list_namespace()
        if res is not None:
            for item in res.items:
                if ((item.metadata.managed_fields is not None) and (item.metadata.managed_fields[0].manager == 'kube-apiserver') and (item.metadata.name != 'default')):
                    continue
                
                data = dict()
                data['name'] = item.metadata.name
                data['crt_time'] = format_datetime(item.metadata.creation_timestamp)
                
                namespace_list.append(data)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    return namespace_list


# pod 조회 
def list_all_pods(namespace, node):
    namespace_list = list_namespace_except_system()
    pods_list = list()

    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        if namespace is None:
            res = core_v1.list_pod_for_all_namespaces(
            )
        elif namespace is not None:
            res = core_v1.list_namespaced_pod(
                namespace
            )

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for pod in res.items:
            data = dict()
            if (node is not None and node != pod.spec.node_name):
                continue

            for namespace in namespace_list:
                if(namespace["name"] == pod.metadata.namespace):
                    data['namespace'] = pod.metadata.namespace
                    data['node_name'] = pod.spec.node_name
                    data['pod_name'] = pod.metadata.name
                    data['host_ip'] = pod.status.host_ip
                    data['pod_ip'] = pod.status.pod_ip
                    data['status'] = pod.status.phase
                    data['crt_time'] = format_datetime(pod.metadata.creation_timestamp)
                    
                    for container in pod.spec.containers:
                        if container.image is not None:
                            if WEBSERVER_NAME in container.image:
                                data['container_port'] = WEBSERVER_PORT
                    
                    if (
                        pod.metadata.deletion_timestamp is None
                        and pod.status.phase == PHASE_RUNNING
                        ):
                            pods_list.append(data)

    return pods_list

# 특정 Pod 삭제  
def delete_pod(namespace_name, pod_name):
    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        core_v1.delete_namespaced_pod_with_http_info(
            name=pod_name,
            namespace=namespace_name
        )

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
    
    return "ok"

# 이미지 배포
def create_pod(namespace_name, node_name, pod_name, image_name):
    pod_manifest = pod_template(namespace_name, node_name, pod_name, image_name)
    
    ready = False
    count = 0
    total_cnt = 10

    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        core_v1.create_namespaced_pod(
            namespace = namespace_name,
            body= pod_manifest
        )

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    while not ready:
        time.sleep(1)

        count += 1
        Log.info("\n>>> 파드 상태 확인 (#%d)" % count)
        Log.info(">>> %s" % datetime.now())

        pod = get_pod(namespace_name, pod_name)
        if pod is None:
            ready = False
        else:
            ready = collect_pod_ready_status(ready, pod, pod_name)

        Log.info(f'{pod_name} is ready :: {ready}')

        if count >= total_cnt:
            break
        
            
    if ready:
        Log.info("파드 생성 완료")
        return "ok"
    
    return "error"


def get_pod(namespace_name, pod_name):
    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        pod_list = core_v1.list_namespaced_pod(
            namespace_name
        )
            
        for pod in pod_list.items:
            if(pod_name == pod.metadata.name):
                if (
                pod.metadata.deletion_timestamp is None
                and pod.status.phase == PHASE_RUNNING
                ):
                    break;

        return pod

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status 


def collect_pod_ready_status(ready, pod, pod_name):

    if pod.status is None:
        return False
    
    if(pod_name == pod.metadata.name):
        for condition in pod.status.conditions:
            if condition.type == CONDITION_READY:
                state: str
                if (
                    pod.metadata.deletion_timestamp != None
                    and pod.status.phase == PHASE_RUNNING
                ):
                    state = PHASE_TERMINATING
                else:
                    state = pod.status.phase

                if str_to_bool(condition.status) and state == PHASE_RUNNING:
                    ready = True
                else:
                    ready = False

                Log.info(
                    "{}\t\t{}\t\tReady({})".format(
                        pod.metadata.name,
                        state,
                        condition.status,
                    )
                )
                
        return ready


def str_to_bool(v: str):

    return v.lower() in ("yes", "true", "1")

def pod_template(namespace_name, node_name, pod_name, image_name):
    return {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
        "name": pod_name,
        "namespace": namespace_name
    },
    "spec": {
        "containers": [
        {
            "name": pod_name,
            "image": current_app.config['REPOS_IP'] + ":" + str(current_app.config['REPOS_PORT']) + "/" + image_name
        }
        ],
        "affinity": {
        "nodeAffinity": {
            "requiredDuringSchedulingIgnoredDuringExecution": {
            "nodeSelectorTerms": [
                {
                "matchExpressions": [
                    {
                    "key": "kubernetes.io/hostname",
                    "operator": "In",
                    "values": [
                        node_name
                    ]
                    }
                ]
                }
            ]
            }
        }
        }
    }
    }

# deployment 리스트 조회 ------------------------ https://github.com/kubernetes-client/python/blob/master/kubernetes/docs/AppsV1Api.md
def list_namespaced_deployment(namespace):
    deployment_list = list()
    try:
        load_k8s_config()
        core_apps_v1 = client.AppsV1Api()
        if namespace is None:
            res = core_apps_v1.list_deployment_for_all_namespaces()
        elif namespace is not None:
            res = core_apps_v1.list_namespaced_deployment(namespace)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
    if res is not None:
        for item in res.items:
            deployment = dict()

            deployment['namespace'] = item.metadata.namespace
            deployment['name'] = item.metadata.name

            deployment['ready_replicas'] = item.status.ready_replicas
            deployment['replicas'] = item.status.replicas
            deployment['updated_replicas'] = item.status.updated_replicas
            deployment['available_replicas'] = item.status.available_replicas

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            deployment['age'] = str(age - timedelta(microseconds=age.microseconds))
            
            containers = list()
            images = list()

            for container in item.spec.template.spec.containers:
                containers.append(container.name)
                images.append(container.image)
            deployment['containers'] = containers
            deployment['images'] = images

            selector = ""
            if item.spec.selector.match_labels is not None:
                for selector_key in item.spec.selector.match_labels.keys():
                    selector += selector_key
                    selector += '='
                    selector += item.spec.selector.match_labels[selector_key]
                    selector += ','
                selector = selector[:-1]
            deployment['selector'] = selector

            deployment_list.append(deployment)
    else:
        return None
    
    return deployment_list

# daemonset 리스트 조회
def list_namespaced_daemon_set(namespace):
    daemonset_list = list()

    try:
        load_k8s_config()
        core_apps_v1 = client.AppsV1Api()
        if namespace is None:
            res = core_apps_v1.list_daemon_set_for_all_namespaces()
        elif namespace is not None:
            res = core_apps_v1.list_namespaced_daemon_set(namespace)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            daemonset = dict()
            
            daemonset['namespace'] = item.metadata.namespace
            daemonset['name'] = item.metadata.name
            daemonset['desired_number_scheduled'] = item.status.desired_number_scheduled
            daemonset['current_number_scheduled'] = item.status.current_number_scheduled
            daemonset['number_ready'] = item.status.number_ready
            daemonset['updated_number_scheduled'] = item.status.updated_number_scheduled
            daemonset['number_available'] = item.status.number_available

            node_selector = ""
            if item.spec.template.spec.node_selector is not None:
                for node_selector_key in item.spec.template.spec.node_selector.keys():
                    node_selector += node_selector_key
                    node_selector += '='
                    node_selector += item.spec.template.spec.node_selector[node_selector_key]
                    node_selector += ','
                node_selector = node_selector[:-1]
            daemonset['node_selector'] = node_selector

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            daemonset['age'] = str(age - timedelta(microseconds=age.microseconds))

            containers = list()
            images = list()
            for container in item.spec.template.spec.containers:
                containers.append(container.name)
                images.append(container.image)
            daemonset['containers'] = containers
            daemonset['images'] = images

            selector = ""
            if item.spec.selector.match_labels is not None:
                for selector_key in item.spec.selector.match_labels.keys():
                    selector += selector_key
                    selector += '='
                    selector += item.spec.selector.match_labels[selector_key]
                    selector += ','
                selector = selector[:-1]
            daemonset['selector'] = selector

            daemonset_list.append(daemonset)
    else:
        return None
    
    return daemonset_list

# replicaset 리스트 조회
def list_namespaced_replica_set(namespace):
    replicaset_list = list()

    try:
        load_k8s_config()
        core_apps_v1 = client.AppsV1Api()
        if namespace is None:
            res = core_apps_v1.list_replica_set_for_all_namespaces()
        elif namespace is not None:
            res = core_apps_v1.list_namespaced_replica_set(namespace)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            replicaset = dict()
            
            replicaset['namespace'] = item.metadata.namespace
            replicaset['name'] = item.metadata.name
            replicaset['desired-replicas'] = int(item.metadata.annotations['deployment.kubernetes.io/desired-replicas'])
            replicaset['current_replicas'] = item.status.available_replicas
            replicaset['ready_replicas'] = item.status.ready_replicas

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            replicaset['age'] = str(age - timedelta(microseconds=age.microseconds))

            containers = list()
            images = list()
            for container in item.spec.template.spec.containers:
                containers.append(container.name)
                images.append(container.image)
            replicaset['containers'] = containers
            replicaset['images'] = images

            selector = ""
            if item.spec.selector.match_labels is not None:
                for selector_key in item.spec.selector.match_labels.keys():
                    selector += selector_key
                    selector += '='
                    selector += item.spec.selector.match_labels[selector_key]
                    selector += ','
                selector = selector[:-1]
            replicaset['selector'] = selector

            replicaset_list.append(replicaset)
    else:
        return None
    
    return replicaset_list

# statefulset 리스트 조회
def list_namespaced_stateful_set(namespace):
    statefulset_list = list()

    try:
        load_k8s_config()
        core_apps_v1 = client.AppsV1Api()
        if namespace is None:
            res = core_apps_v1.list_stateful_set_for_all_namespaces()
        elif namespace is not None:
            res = core_apps_v1.list_namespaced_stateful_set(namespace)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            statefulset = dict()
            statefulset['namespace'] = item.metadata.namespace
            statefulset['name'] = item.metadata.name
            if item.status.ready_replicas is None:
                statefulset['ready_replicas'] = 0
            else:
                statefulset['ready_replicas'] = item.status.ready_replicas
            statefulset['replicas'] = item.spec.replicas

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            statefulset['age'] = str(age - timedelta(microseconds=age.microseconds))

            statefulset['replicas'] = item.status.replicas

            containers = list()
            images = list()
            for container in item.spec.template.spec.containers:
                containers.append(container.name)
                images.append(container.image)
            statefulset['containers'] = containers
            statefulset['images'] = images
            
            statefulset_list.append(statefulset)
    else:
        return None
    
    return statefulset_list

# job 리스트 조회 ----------------------------- https://github.com/kubernetes-client/python/blob/master/kubernetes/docs/BatchV1Api.md
def list_namespaced_job(namespace):
    job_list = list()

    try:
        load_k8s_config()
        core_batch_v1 = client.BatchV1Api()
        if namespace is None:
            res = core_batch_v1.list_job_for_all_namespaces()
        elif namespace is not None:
            res = core_batch_v1.list_namespaced_job(namespace)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
    if res is not None:
        for item in res.items:
            job = dict()
            job['namespace'] = item.metadata.namespace
            job['name'] = item.metadata.name
            job['completions'] = item.spec.completions

            start_time = item.status.start_time.astimezone()
            completion_time = item.status.completion_time.astimezone()
            duration = completion_time - start_time
            job['duration'] = str(duration - timedelta(microseconds=duration.microseconds))

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            job['age'] = str(age - timedelta(microseconds=age.microseconds))

            containers = list()
            images = list()
            for container in item.spec.template.spec.containers:
                containers.append(container.name)
                images.append(container.image)
            job['containers'] = containers
            job['images'] = images

            selector = ""
            if item.spec.selector.match_labels is not None:
                for selector_key in item.spec.selector.match_labels.keys():
                    selector += selector_key
                    selector += '='
                    selector += item.spec.selector.match_labels[selector_key]
                    selector += ','
                selector = selector[:-1]
            job['selector'] = selector

            job_list.append(job)
    else:
        return None

    return job_list

# persistent_volume 리스트 조회
def list_persistent_volume():
    persistent_volume_list = list()

    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        res = core_v1.list_persistent_volume()

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            persistent_volume = dict()
            persistent_volume['name'] = item.metadata.name
            persistent_volume['capacity'] = item.spec.capacity['storage']
            persistent_volume['access_modes'] = item.spec.access_modes
            persistent_volume['persistent_volume_reclaim_policy'] = item.spec.persistent_volume_reclaim_policy
            persistent_volume['status'] = item.status.phase
            
            claim = ""
            claim = item.spec.claim_ref.namespace + '/' + item.spec.claim_ref.name
            persistent_volume['claim'] = claim

            persistent_volume['storage_class_name'] = item.spec.storage_class_name
            persistent_volume['reason'] = item.status.reason

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            persistent_volume['age'] = str(age - timedelta(microseconds=age.microseconds))
            
            persistent_volume['volume_mode'] = item.spec.volume_mode

            persistent_volume_list.append(persistent_volume)
    else:
        return None
    
    return persistent_volume_list

# persistent volume claim 리스트 조회
def list_namespaced_persistent_volume_claim(namespace):
    persistent_volume_claim_list = list()

    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        if namespace is None:
            res = core_v1.list_persistent_volume_claim_for_all_namespaces()
        elif namespace is not None:
            res = core_v1.list_namespaced_persistent_volume_claim(namespace)
  
    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            persistent_volume_claim = dict()
            persistent_volume_claim['namespace'] = item.metadata.namespace
            persistent_volume_claim['name'] = item.metadata.name
            persistent_volume_claim['status'] = item.status.phase
            persistent_volume_claim['volume_name'] = item.spec.volume_name
            persistent_volume_claim['capacity'] = item.status.capacity['storage']
            persistent_volume_claim['access_modes'] = item.spec.access_modes
            persistent_volume_claim['storage_class_name'] = item.spec.storage_class_name

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            persistent_volume_claim['age'] = str(age - timedelta(microseconds=age.microseconds))
            
            persistent_volume_claim['volume_mode'] = item.spec.volume_mode

            persistent_volume_claim_list.append(persistent_volume_claim)
    else:
        return None

    return persistent_volume_claim_list
    

# storageclass 리스트 조회 -------------------- https://github.com/kubernetes-client/python/blob/master/kubernetes/docs/StorageV1Api.md
def list_storage_class():
    storage_class_list = list()

    try:
        load_k8s_config()
        storage_v1 = client.StorageV1Api()
        res = storage_v1.list_storage_class()

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            storage_class = dict()
            storage_class['name'] = item.metadata.name
            storage_class['provisioner'] = item.provisioner
            storage_class['reclaim_policy'] = item.reclaim_policy
            storage_class['volume_binding_mode'] = item.volume_binding_mode
            storage_class['allow_volume_expansion'] = item.allow_volume_expansion
            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            storage_class['age'] = str(age - timedelta(microseconds=age.microseconds))
            
            storage_class_list.append(storage_class)
    else:
        return None

    return storage_class_list

# service 리스트 조회
def list_namespaced_service(namespace):
    service_list = list()

    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        if namespace is None:
            res = core_v1.list_service_for_all_namespaces()
        elif namespace is not None:
            res = core_v1.list_namespaced_service(namespace)

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status

    if res is not None:
        for item in res.items:
            service = dict()
            service['namespace'] = item.metadata.namespace
            service['name'] = item.metadata.name
            service['type'] = item.spec.type
            service['cluster_ip'] = item.spec.cluster_ip
            service['external_ip'] = item.spec.external_i_ps
            ports = ""
            for port in item.spec.ports:
                if port.node_port is None:
                    ports += str(port.port)
                    ports += "/"
                    ports += port.protocol
                    ports += ","
                else:
                    ports += str(port.port)
                    ports += ":"
                    ports += str(port.node_port)
                    ports += "/"
                    ports += port.protocol
                    ports += ","

            if ports != "":
                ports = ports[:-1]

            service['ports'] = ports

            now = datetime.now().astimezone()
            creation_timestamp = item.metadata.creation_timestamp.astimezone()
            age = now - creation_timestamp
            service['age'] = str(age - timedelta(microseconds=age.microseconds))

            selector = ""
            if item.spec.selector is not None:
                for selector_key in item.spec.selector.keys():
                    selector += selector_key
                    selector += '='
                    selector += item.spec.selector[selector_key]
                    selector += ','

                selector = selector[:-1]

            service['selector'] = selector
            service_list.append(service)
    else:
        return None

    return service_list




# 디플로이먼트 배포
def create_deployment(namespace_name, deployment_name, image_name, replicas, containerPort):
    if not get_deployment(namespace_name, deployment_name) is None:
        return "existed"

    deployment_manifest = deployment_template(namespace_name, deployment_name, image_name, replicas, containerPort)
    
    ready = False
    count = 0
    total_cnt = 10

    try:
        load_k8s_config()
        core_apps_v1 = client.AppsV1Api()
        core_apps_v1.create_namespaced_deployment(
            namespace = namespace_name,
            body= deployment_manifest
        )

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
        
    while not ready:
        time.sleep(1)

        count += 1
        Log.info(">>> 디플로이먼트 상태 확인 (#%d)" % count)
        Log.info(">>> %s" % datetime.now())

        deployment = get_deployment(namespace_name, deployment_name)
        if deployment is None:
            ready = False
        else:
            ready = collect_deployment_ready_status(ready, deployment, deployment_name)

        Log.info(f'{deployment_name} is ready :: {ready}')

        if count >= total_cnt:
            break
            
    if ready:
        Log.info("디플로이먼트 생성 완료")
        return "ok"
    return "error"


def get_deployment(namespace_name, deployment_name):
    try:
        load_k8s_config()
        core_apps_v1 = client.AppsV1Api()
        deployment_list = core_apps_v1.list_namespaced_deployment(
            namespace_name
        )
        
        for deployment in deployment_list.items:
            if(deployment_name == deployment.metadata.name):
                if (deployment.metadata.deletion_timestamp is None
                and deployment.status.unavailable_replicas is None):
                    return deployment
                else:
                    return None
    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status 

def deployment_template(namespace_name, deployment_name, image_name, replicas, container_port):
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": deployment_name,
            "namespace": namespace_name,
            "labels": {
                "app": deployment_name
            }
        },
        "spec": {
            "replicas": replicas,
            "selector" : {
                "matchLabels": {
                    "app": deployment_name
                }
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": deployment_name
                    }
                },
                "spec": {
                    "containers": [
                        {
                            "name": deployment_name,
                            "image": current_app.config['REPOS_IP'] + ":" + str(current_app.config['REPOS_PORT']) + "/" + image_name,
                            "ports": [
                                {
                                    "containerPort":container_port
                                }
                            ],
                            "resources": {
                                "requests": {
                                    "memory": "64Mi",
                                    "cpu": "250m"
                                },
                                "limits": {
                                    "memory": "128Mi",
                                    "cpu": "500m"
                                }
                            }
                        }
                    ],
                    "affinity": {
                        "nodeAffinity": {
                            "requiredDuringSchedulingIgnoredDuringExecution": {
                                "nodeSelectorTerms": [
                                {
                                    "matchExpressions": [
                                        {
                                        "key": "kubernetes.io/arch",
                                        "operator": "In",
                                        "values": [
                                            "amd64"
                                        ]
                                        }
                                    ]
                                }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }

def collect_deployment_ready_status(ready, deployment, deployment_name):
    if deployment.status is None:
        return False
    
    if(deployment_name == deployment.metadata.name):
        replicas = deployment.status.replicas
        ready_replicas = deployment.status.ready_replicas

        if replicas == ready_replicas:
            ready = True
        else:
            ready = False

        Log.info(
            "{}\t\tReplicas:{}\t\tReady_replicas:{}".format(
                deployment.metadata.name,
                replicas,
                ready_replicas
            )
        )
        return ready


def create_service(service_name, namespace, service_type, selector, port, target_port, node_port):
    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        service = client.V1Service(
                api_version="v1",
                kind="Service",
                metadata=client.V1ObjectMeta(
                    name=service_name,
                    namespace=namespace
                ),
                spec=client.V1ServiceSpec(
                    type=service_type,
                    selector={selector.split("=")[0]: selector.split("=")[1]},
                    ports=[client.V1ServicePort(
                        port=port,
                        target_port=target_port
                    )]
                )
            )
        if service_type=='NodePort': 
            if not node_port == 'none':
                service.spec.ports[0].node_port = int(node_port)     

        core_v1.create_namespaced_service(namespace=namespace, body=service) 


    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
    
    return "ok"

# 특정 deployment 삭제  
def delete_deployment_name(namespace_name, deployment_name):
    try:
        load_k8s_config()
        core_v1 = client.AppsV1Api()
        core_v1.delete_namespaced_deployment(
            name=deployment_name,
            namespace=namespace_name
        )

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
    
    return "ok"


# 특정 Service 삭제  
def delete_service(namespace_name, service_name):
    try:
        load_k8s_config()
        core_v1 = client.CoreV1Api()
        core_v1.delete_namespaced_service(
            name=service_name,
            namespace=namespace_name
        )

    except ApiException as ex:
        Log.error(ex)
        return ex.reason, ex.status
    
    return "ok"

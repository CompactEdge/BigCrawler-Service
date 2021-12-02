import json
from json.encoder import py_encode_basestring_ascii
import click
from kubernetes import client, config
from kubernetes.client.exceptions import ApiException
from pytz import timezone
import requests
import time
from datetime import datetime

REPOS_URL = "192.168.7.166:5000/"
WEBSERVER_NAME = "service"
WEBSERVER_PORT = "8080"
SLEEP_TIME = 3

CONDITION_READY = "Ready"
PHASE_TERMINATING = "Terminating"
PHASE_RUNNING = "Running"


config.load_kube_config()

# 전체 node 리스트 조회
def list_node():
    node_list = list()
    try:
        core_v1 = client.CoreV1Api()
        res = core_v1.list_node()
        if res is not None:
            for node in res.items:
                if node.metadata.managed_fields[0].manager != 'kube-apiserver':
                    data = dict()

                    data['name'] = node.metadata.name
                    data['crt_time'] = node.metadata.creation_timestamp.astimezone(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S')
                    if('node-role.kubernetes.io/master' in node.metadata.labels):
                        data['node_role'] = 'master'
                    else:
                        data['node_role'] = 'worker'    

                    node_list.append(data)            
        else:
            click.echo("fail to list node")
            
    except ApiException as ex:
        log_api_exception(ex)
        return ex.reason, ex.status

    return node_list

# 전체 namespace 리스트 조회
def list_namespace():
    namespace_list = list()
    try:
        core_v1 = client.CoreV1Api()
        res = core_v1.list_namespace()
        if res is not None:
            for namespace in res.items:
                if ((namespace.metadata.managed_fields[0].manager != 'kube-apiserver') or (namespace.metadata.name == 'default')):
                    data = dict()
                    data['name'] = namespace.metadata.name
                    data['crt_time'] = namespace.metadata.creation_timestamp.astimezone(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S')

                    namespace_list.append(data)
        else:
            click.echo("fail to list namespace")
            
    except ApiException as ex:
        log_api_exception(ex)
        return ex.reason, ex.status

    return namespace_list

# system 제외 
def list_namespace_except_system():
    namespace_list = list()
    try:
        core_v1 = client.CoreV1Api()
        res = core_v1.list_namespace()
        if res is not None:
            for namespace in res.items:
                if ((namespace.metadata.managed_fields[0].manager != 'kube-apiserver') or (namespace.metadata.name == 'default')):
                    data = dict()
                    data['name'] = namespace.metadata.name
                    data['crt_time'] = namespace.metadata.creation_timestamp.astimezone(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S')
                    
                    namespace_list.append(data)

    except ApiException as ex:
        log_api_exception(ex)
        return ex.reason, ex.status

    return namespace_list


# pod 조회 
def list_all_pods(namespace, node):
    namespace_list = list_namespace_except_system()
    pods_list = list()

    try:
        core_v1 = client.CoreV1Api()
        if namespace is None:
            res = core_v1.list_pod_for_all_namespaces(
            )
        elif namespace is not None:
            res = core_v1.list_namespaced_pod(
                namespace
            )

    except ApiException as ex:
        log_api_exception(ex)
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
                    data['crt_time'] = pod.metadata.creation_timestamp.astimezone(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S')
                    
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
        core_v1 = client.CoreV1Api()
        core_v1.delete_namespaced_pod_with_http_info(
            name=pod_name,
            namespace=namespace_name
        )

    except ApiException as ex:
        log_api_exception(ex)
        return ex.reason, ex.status
    
    return "ok"

# 이미지 배포
def create_pod(namespace_name, node_name, pod_name, image_name):
    pod_manifest = pod_template(namespace_name, node_name, pod_name, image_name)
    
    ready = False
    count = 0
    total_cnt = 10

    try:
        core_v1 = client.CoreV1Api()
        core_v1.create_namespaced_pod(
            namespace = namespace_name,
            body= pod_manifest
        )

    except ApiException as ex:
        log_api_exception(ex)
        return ex.reason, ex.status

    while not ready:
        time.sleep(1)

        count += 1
        click.echo("\n>>> 파드 상태 확인 (#%d)" % count)
        click.echo(">>> %s" % datetime.now())

        pod = get_pod(namespace_name, pod_name)
        if pod is None:
            ready = False
        else:
            ready = collect_pod_ready_status(ready, pod, pod_name)

        click.echo(f'{pod_name} is ready :: {ready}')

        if count >= total_cnt:
            break
        
            
    if ready:
        click.echo("파드 생성 완료")
        return "ok"
    
    return "error"


def get_pod(namespace_name, pod_name):
    try:
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
        log_api_exception(ex)
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

                click.echo(
                    "{}\t\t{}\t\tReady({})".format(
                        pod.metadata.name,
                        state,
                        condition.status,
                    )
                )
                
        return ready


def run_pod(namespace, pod_name):
    try:
        core_v1 = client.CoreV1Api()
        pod = core_v1.read_namespaced_pod(
            name=pod_name,
            namespace=namespace
        )
        pod_ip = pod.status.pod_ip

    except ApiException as ex:
        log_api_exception(ex)
        
        return ex.reason, ex.status

    request_headers = {
        'accept': 'application/json'
    }

    url = "http://" + pod_ip + ":" + WEBSERVER_PORT + "/rest/1.0/service/start"
    response = requests.get(url, headers = request_headers).json()

    url = "http://" + pod_ip + ":" + WEBSERVER_PORT + "/rest/1.0/service/status"
    status = response
    if status == "starting":
        while(status != "waiting"):
            time.sleep(SLEEP_TIME)
            status = requests.get(url, headers = request_headers).json()

        return "ok"

    return "error"

def str_to_bool(v: str):

    return v.lower() in ("yes", "true", "1")

def log_api_exception(ex: ApiException):
    click.echo("%s %s" % (ex.status, ex.reason))
    click.echo(json.dumps(ex.headers.__dict__, indent=4))
    click.echo(json.dumps(json.loads(ex.body), indent=4))

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
            "image": REPOS_URL + image_name
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
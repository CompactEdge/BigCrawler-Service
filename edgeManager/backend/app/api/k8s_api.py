from app.model import k8s_model
from flask import abort, request
from flask_restx import Namespace, Resource
from utils.logger import Log

ns = Namespace("Kubernetes api", description="Kubernetes node related operations")


# 전체 node 리스트 조회
@ns.route("/node", methods=['GET'])
@ns.doc("list kubernetes node")
class NodeList(Resource):

    def get(self):
        """List all Nodes"""
        Log.info("List all Nodes")

        return k8s_model.list_node()


# 전체 namespace 조회
@ns.route("/namespace", methods=['GET'])
@ns.doc("list kubernetes namspace")
class NamespaceList(Resource):

    def get(self):
        """List all Namespaces"""
        Log.info("List all Namespaces")

        return k8s_model.list_namespace()


# pod 조회 
@ns.route("/pod", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.param("node", "The kubernetes node name")
@ns.doc("list kubernetes pod")
class PodList(Resource):

    def get(self):
        """List Pod"""
        namespace = request.args.get('namespace')
        node = request.args.get('node')
        Log.info("List Pod")

        return k8s_model.list_all_pods(namespace, node)

# deployment 조회 
@ns.route("/deployment", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes deployment")
class DeploymentList(Resource):

    def get(self):
        """List Deployment"""
        namespace = request.args.get('namespace')
        Log.info("List Deployment")

        return k8s_model.list_namespaced_deployment(namespace)

# daemonset 조회 
@ns.route("/daemonset", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes daemonset")
class DaemonsetList(Resource):

    def get(self):
        """List Daemonset"""
        namespace = request.args.get('namespace')
        Log.info("List Daemonset")

        return k8s_model.list_namespaced_daemon_set(namespace)

# replicaset 조회 
@ns.route("/replicaset", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes replicaset")
class ReplicasetList(Resource):

    def get(self):
        """List Replicaset"""
        namespace = request.args.get('namespace')
        Log.info("List Replicaset")

        return k8s_model.list_namespaced_replica_set(namespace)

# statefulset 조회 
@ns.route("/statefulset", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes statefulset")
class StatefulsetList(Resource):

    def get(self):
        """List Statefulset"""
        namespace = request.args.get('namespace')
        Log.info("List Statefulset")

        return k8s_model.list_namespaced_stateful_set(namespace)

# job 조회 
@ns.route("/job", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes job")
class JobList(Resource):

    def get(self):
        """List Job"""
        namespace = request.args.get('namespace')
        Log.info("List Job")

        return k8s_model.list_namespaced_job(namespace)

# persistent volume 조회 
@ns.route("/persistent_volume", methods=['GET'])
@ns.doc("list kubernetes persistent volume")
class PersistentVolumeList(Resource):

    def get(self):
        """List all Persistent volume"""
        Log.info("List all Persistent volume")

        return k8s_model.list_persistent_volume()

# persistent volume claim 조회 
@ns.route("/persistent_volume_claim", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes persistent volume claim")
class PersistentVolumeClaimList(Resource):

    def get(self):
        """List Persistent volume claim"""
        namespace = request.args.get('namespace')
        Log.info("List Persistent volume claim")

        return k8s_model.list_namespaced_persistent_volume_claim(namespace)

# 전체 storageclass 조회
@ns.route("/storageclass", methods=['GET'])
@ns.doc("list kubernetes storageclass")
class StorageclassList(Resource):

    def get(self):
        """List all Storageclass"""
        Log.info("List all Storageclass")

        return k8s_model.list_storage_class()


# 전체 service 조회
@ns.route("/service", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("list kubernetes service")
class ServiceList(Resource):

    def get(self):
        """List Service"""
        namespace = request.args.get('namespace')
        Log.info("List Service")

        return k8s_model.list_namespaced_service(namespace)


# 특정 Pod 삭제 
@ns.route("/pod/<string:namespace>/<string:pod_name>", methods=['DELETE'])
@ns.param("pod_name", "The kubernetes pod name")
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("Delete specific pod in specific node")
class DeletePod(Resource):

    def delete(self, namespace, pod_name):
        """Delete specific pod in specific namespace"""
        Log.info("Delete specific pod in specific namespace")

        return k8s_model.delete_pod(namespace, pod_name)


# 특정 node에 local repository에 있는 image 띄우기
@ns.route("/pod/<string:namespace>/<string:node>/<string:image>/<string:pod_name>", methods=['POST'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.param("node", "The kubernetes node name")
@ns.param("image", "image in repository")
@ns.param("pod_name", "The kubernetes pod name")
@ns.doc("Create pod")
class CreatePod(Resource):

    def post(self, namespace, node, pod_name, image):
        """Create pod"""

        res = k8s_model.create_pod(namespace, node, pod_name, image)
        if res == "error":
            abort(500)
        else:
            Log.info("Create pod")
            return res

# 특정 node에 local repository에 있는 image로 deployment 띄우기
@ns.route("/deployment/<string:namespace>/<string:image>/<string:deployment_name>/<int:replicas>/<int:container_port>", methods=['POST'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.param("image", "image in repository")
@ns.param("deployment_name", "The kubernetes deployment name")
@ns.param("container_port", "The kubernetes container port")
@ns.doc("Create deployment")
class CreateDeployment(Resource):

    def post(self, namespace, deployment_name, image, replicas, container_port):
        """Create deployment"""
        
        res = k8s_model.create_deployment(namespace, deployment_name, image, replicas, container_port)
        if res == "error":
            abort(500)
        elif res == "existed":
            return "Already existed"
        else:
            Log.info("Create deployment")
            return res


# service 생성
@ns.route("/service/<string:namespace>/<string:service_name>/<string:service_type>/<string:selector>/<int:port>/<int:target_port>/<string:node_port>", methods=['POST'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.param("service_name", "The kubernetes service name")
@ns.param("service_type", "The kubernetes service type")
@ns.param("selector", "The kubernetes service selector")
@ns.param("port", "The kubernetes service port")
@ns.param("target_port", "The kubernetes service target port")
@ns.param("node_port", "The kubernetes service node port")
@ns.doc("Create service")
class CreateService(Resource):
    def post(self, service_name, namespace, service_type, selector, port, target_port, node_port):
        """Create service"""
        res = k8s_model.create_service(service_name, namespace, service_type, selector, port, target_port, node_port)

        if res == "error":
            abort(500)
        elif res == "existed":
            return "Already existed"
        else:
            Log.info("Create service")
            return res


# 특정 deployment 삭제 
@ns.route("/deployment/<string:namespace>/<string:deployment_name>", methods=['DELETE'])
@ns.param("deployment_name", "The kubernetes deployment name")
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("Delete specific deployment in specific node")
class DeleteDeployment(Resource):

    def delete(self, namespace, deployment_name):
        """Delete specific deployment in specific namespace"""
        Log.info("Delete specific deployment in specific namespace")
       
        return k8s_model.delete_deployment_name(namespace, deployment_name)


# 특정 service 삭제 
@ns.route("/service/<string:namespace>/<string:service_name>", methods=['DELETE'])
@ns.param("service_name", "The kubernetes service name")
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("Delete specific service in specific node")
class DeleteService(Resource):

    def delete(self, namespace, service_name):
        """Delete specific service in specific namespace"""
        Log.info("Delete specific service in specific namespace")
       
        return k8s_model.delete_service(namespace, service_name)
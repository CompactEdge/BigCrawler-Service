from flask_restx import Namespace, Resource
from app.model import k8s_model
from flask import request, abort

ns = Namespace("Kubernetes api", description="Kubernetes node related operations")

# 전체 node 리스트 조회
@ns.route("/node", methods=['GET'])
@ns.doc("list kubernetes node")
class NodeList(Resource):

    def get(self):
        """List all Nodes"""

        return k8s_model.list_node()

# 전체 namespace 조회
@ns.route("/namespace", methods=['GET'])
@ns.doc("list kubernetes namspace")
class NamespaceList(Resource):

    def get(self):
        """List all Namespaces"""

        return k8s_model.list_namespace()

# pod 조회 
@ns.route("/pod", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.param("node", "The kubernetes node name")
class PodsList(Resource):

    def get(self):
        """List Pods"""

        namespace = request.args.get('namespace')
        node = request.args.get('node')

        return k8s_model.list_all_pods(namespace, node)


# 특정 Pod 삭제 
@ns.route("/pod/<string:namespace>/<string:pod_name>", methods=['DELETE'])
@ns.param("pod_name", "The kubernetes pod name")
@ns.param("namespace", "The kubernetes namespace name")
@ns.doc("Delete specific pod in specific node")
class DeletePod(Resource):

    def delete(self, namespace, pod_name):
       """Delete specific pod in specific namespace"""
       
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
            return res
       

@ns.route("/run/<string:namespace>/<string:pod_name>", methods=['GET'])
@ns.param("namespace", "The kubernetes namespace name")
@ns.param("pod_name", "The kubernetes pod name")
#@ns.response(500)
class RunPod(Resource):

    def get(self, namespace, pod_name):
        """Run specific pod in specific namespace"""

        res = k8s_model.run_pod(namespace,pod_name)
        if res == "error":
            abort(500)
        else:
            return res
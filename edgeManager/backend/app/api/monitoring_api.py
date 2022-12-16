from http import HTTPStatus

import app.model.monitoring_model as monitoring_model
from app.service.monitoring_service import KubernetesMonitoringService
from flask import jsonify, make_response
from flask_restx import Resource

monitoring_ns = monitoring_model.ns


@monitoring_ns.route("/module_info/<string:resource_name>")
@monitoring_ns.doc("")
class ModuleInfoResourcesMonitoring(Resource):
    
    module_info_parser = monitoring_model.module_info_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(module_info_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self, resource_name):
        """ Kubernetes Pod Resources """
        module_info_args = self.module_info_parser.parse_args()
        
        meta_name = { "meta_name": "ModuleInfoMonitoring" }
        meta_items = {
            "cpu": ["CPU Speed", "CPU Usage"],
            "memory": ["Memory Usage", "Memory Size"],
            "disk": ["Disk Usage", "Disk Response Time"],
            "network": ["Network Usage", "Network Speed"]
        }
        variable_values = module_info_args["node"]
        
        result_data = self.k8s_monitoring_service.find_by_module_info(meta_name, meta_items[resource_name], variable_values)
        
        return make_response(jsonify(result_data), HTTPStatus(200 if len(result_data.keys()) > 0 else 500))


@monitoring_ns.route("/module_info")
@monitoring_ns.doc("")
class ModuleInfoMonitoring(Resource):
    
    module_info_parser = monitoring_model.module_info_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(module_info_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Kubernetes Pod Resources """
        module_info_args = self.module_info_parser.parse_args()
        meta_name = { "meta_name": "ModuleInfoMonitoring" }
        meta_data = self.k8s_monitoring_service.find_by_monitoring_meta_datas(meta_name)
        meta_items = meta_data["data"]["result"]
        variable_values = module_info_args["node"]
        
        result_data = self.k8s_monitoring_service.find_by_module_info(meta_name, meta_items, variable_values)
        
        return make_response(jsonify(result_data), HTTPStatus(200 if len(result_data.keys()) > 0 else 500))
    

@monitoring_ns.route("/pod_monitoring")
@monitoring_ns.doc("")
class PodMonitoring(Resource):
    
    pod_monitoring_parser = monitoring_model.pod_monitoring_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(pod_monitoring_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Kubernetes Pod Resources """
        pod_monitoring_args = self.pod_monitoring_parser.parse_args()
        result_data = self.k8s_monitoring_service.find_by_monitoring_query_range(pod_monitoring_args)
        
        return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))
    
    
@monitoring_ns.route("/gpu_monitoring")
@monitoring_ns.doc("")
class GpuMonitoring(Resource):
    
    gpu_monitoring_parser = monitoring_model.gpu_monitoring_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(gpu_monitoring_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Gpu Compute Resources """
        gpu_monitoring_args = self.gpu_monitoring_parser.parse_args()
        result_data = self.k8s_monitoring_service.find_by_monitoring_query_range(gpu_monitoring_args)
        
        return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))
    

@monitoring_ns.route("/node_monitoring")
@monitoring_ns.doc("")
class NodeMonitoring(Resource):
    
    node_monitoring_parser = monitoring_model.node_monitoring_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(node_monitoring_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Node Compute Resources """
        node_monitoring_args = self.node_monitoring_parser.parse_args()
        result_data = self.k8s_monitoring_service.find_by_monitoring_query_range(node_monitoring_args)
        
        return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))


@monitoring_ns.route("/cluster_monitoring")
@monitoring_ns.doc("")
class ClusterMonitoring(Resource):
    
    cluster_monitoring_parser = monitoring_model.cluster_monitoring_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(cluster_monitoring_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Cluster Compute Resources """
        cluster_monitoring_args = self.cluster_monitoring_parser.parse_args()
        result_data = self.k8s_monitoring_service.find_by_monitoring_query_range(cluster_monitoring_args)
        
        return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))

    
@monitoring_ns.route("/variable_values")
@monitoring_ns.doc("")
class VariableValues(Resource):
    
    variable_values_parser = monitoring_model.variable_values_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(variable_values_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Monitoring variable values """
        variable_values_args = self.variable_values_parser.parse_args()
        result_data = self.k8s_monitoring_service.find_by_monitoring_variable_values(variable_values_args)
        
        return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))
    
    
@monitoring_ns.route("/meta_datas")
@monitoring_ns.doc("")
class MetaDatas(Resource):
    
    meta_datas_parser = monitoring_model.meta_datas_parser
    
    
    def __init__(self, api=None, *args, **kwargs):
        self.api = api
        self.k8s_monitoring_service = KubernetesMonitoringService()
    
    
    @monitoring_ns.expect(meta_datas_parser)
    @monitoring_ns.response(200, "{ \"status\": [], \"status_code\": [], \"data\": {} }")
    def get(self):
        """ Monitoring meta datas """
        meta_datas_args = self.meta_datas_parser.parse_args()
        result_data = self.k8s_monitoring_service.find_by_monitoring_meta_datas(meta_datas_args)
        
        return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))
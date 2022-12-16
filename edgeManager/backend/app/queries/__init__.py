from app.queries.cluster_monitoring_queries import CLUSTER_MONITORING
from app.queries.module_info_monitoring_queries import MODULE_INFO_MONITORING
from app.queries.node_monitoring_queries import NODE_MONITORING
from app.queries.pod_monitoring_queries import POD_MONITORING
from app.queries.rabbitmq_monitoring_queries import RABBITMQ_MONITORING

MONITORING_QUERIES = {
    "ClusterMonitoring": CLUSTER_MONITORING,
    "NodeMonitoring": NODE_MONITORING,
    "PodMonitoring": POD_MONITORING,
    "RabbitmqMonitoring": RABBITMQ_MONITORING,
    "ModuleInfoMonitoring": MODULE_INFO_MONITORING
}


VARIABLE_VALUE_QUERIES = {
    "ClusterMonitoring": {
        "Instance": {
            "label": "instance",
            "query":  """up{job="node-exporter"}""",
        }
    },
    "NodeMonitoring": {
        "Instance": {
            "label": "instance",
            "query":  """up{job="node-exporter"}""",
        }
    },
    "GpuMonitoring": {
        "Instance": {
            "label": "instance",
            "query":  """up{job="dcgm-exporter"}""",
        }
    },
    "PodMonitoring": {
        "Namespace": {
            "label": "namespace",
            "query": """kube_namespace_labels"""
        }
    },
    "RabbitmqMonitoring": {
        "Namespace": {
            "label": "namespace",
            "query": """rabbitmq_build_info"""
        }
    }
}
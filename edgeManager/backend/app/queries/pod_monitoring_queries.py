POD_MONITORING = {
    "CPU Usage": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """CPU Usage""",
            "expr_units": """""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{{cluster="", {variable_key}=~"{variable_value}"}}) by (pod)"""
        },
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """CPU Usage""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """quota-requests""",
            "expr_query": """scalar(kube_resourcequota{{cluster="", {variable_key}=~"{variable_value}", type="hard",resource="requests.cpu"}})"""
        },
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """CPU Usage""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """quota-limits""",
            "expr_query": """scalar(kube_resourcequota{{cluster="", {variable_key}=~"{variable_value}", type="hard",resource="limits.cpu"}})"""
        }
    ],
    # "CPU Quota": """""",
    "Memory Usage (w/o cache)": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Memory Usage (w/o cache)""",
            "expr_units": """bytes""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(container_memory_working_set_bytes{{job="kubelet", metrics_path="/metrics/cadvisor", cluster="", {variable_key}=~"{variable_value}", container!="", image!=""}}) by (pod)"""
        },
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Memory Usage (w/o cache)""",
            "expr_units": """bytes""",
            "expr_tags_keys": """""",
            "expr_tags_values": """quota-requests""",
            "expr_query": """scalar(kube_resourcequota{{cluster="", {variable_key}=~"{variable_value}", type="hard",resource="requests.memory"}})"""
        },
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Memory Usage (w/o cache)""",
            "expr_units": """bytes""",
            "expr_tags_keys": """""",
            "expr_tags_values": """quota-limits""",
            "expr_query": """scalar(kube_resourcequota{{cluster="", {variable_key}=~"{variable_value}", type="hard",resource="limits.memory"}})"""
        }
    ],
    "Receive Bandwidth": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Receive Bandwidth""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(irate(container_network_receive_bytes_total{{cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (pod)"""
        }
    ],
    "Transmit Bandwidth": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Transmit Bandwidth""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(irate(container_network_transmit_bytes_total{{cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (pod)"""
        }
    ],
    "Rate of Received Packets": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Rate of Received Packets""",
            "expr_units": """packets/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(irate(container_network_receive_packets_total{{cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (pod)"""
        }
    ],
    "Rate of Transmitted Packets": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Rate of Transmitted Packets""",
            "expr_units": """packets/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(irate(container_network_transmit_packets_total{{cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (pod)"""
        }
    ],
    "Rate of Received Packets Dropped": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Rate of Received Packets Dropped""",
            "expr_units": """packets/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(irate(container_network_receive_packets_dropped_total{{cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (pod)"""
        }
    ],
    "Rate of Transmitted Packets Dropped": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """Rate of Transmitted Packets Dropped""",
            "expr_units": """packets/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum(irate(container_network_transmit_packets_dropped_total{{cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (pod)"""
        }
    ],
    "IOPS(Reads+Writes)": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """IOPS(Reads+Writes)""",
            "expr_units": """""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """ceil(sum by(pod) (rate(container_fs_reads_total{{container!="", device=~"(/dev/)?(mmcblk.p.+|nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+)", cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}]) + rate(container_fs_writes_total{{container!="", device=~"(/dev/)?(mmcblk.p.+|nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+)", cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}])))"""
        }
    ],
    "ThroughPut(Read+Write)": [
        {
            "expr_type": """kubeStateMetrics""",
            "expr_name": """ThroughPut(Read+Write)""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """pod""",
            "expr_tags_values": """""",
            "expr_query": """sum by(pod) (rate(container_fs_reads_bytes_total{{container!="", device=~"(/dev/)?(mmcblk.p.+|nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+)", cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}]) + rate(container_fs_writes_bytes_total{{container!="", device=~"(/dev/)?(mmcblk.p.+|nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+)", cluster="", {variable_key}=~"{variable_value}"}}[{rate_interval}]))"""
        }
    ],
}
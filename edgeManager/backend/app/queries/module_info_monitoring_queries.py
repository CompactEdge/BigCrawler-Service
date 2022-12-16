MODULE_INFO_MONITORING = {
    "CPU Speed": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """CPU Speed""",
            "expr_units": """Hz""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """(max (node_cpu_scaling_frequency_hertz{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance))"""
        }
    ],
    "CPU Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """CPU Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """100 - (avg(rate(node_cpu_seconds_total{{job="node-exporter", mode="idle", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (instance) * 100)"""
        }
    ],
    "Memory Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """""",
            "expr_tags_values": """""",
            "expr_query": """100 - (avg(node_memory_MemAvailable_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) / avg(node_memory_MemTotal_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) * 100)"""
        }
    ],
    "Memory Size": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Size""",
            "expr_units": """bytes""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """node_memory_MemTotal_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        }
    ],
    "Disk Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """100 - (sum(node_filesystem_free_bytes{{job="node-exporter", {variable_key}=~"{variable_value}", mountpoint="/"}}) by (instance) / sum(node_filesystem_size_bytes{{job="node-exporter", {variable_key}=~"{variable_value}", mountpoint="/"}}) by (instance) * 100)"""
        }
    ],
    "Disk Response Time": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk Response Time""",
            "expr_units": """seconds""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """sum(rate(node_disk_io_time_seconds_total{{job="node-exporter", {variable_key}=~"{variable_value}"}}[1m])) by (instance) """
        }
    ],
    "Network Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Network Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """(sum(rate(node_network_receive_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}])) by (instance)+sum(rate(node_network_transmit_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}])) by (instance))/sum(node_network_speed_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance) * 100"""
        }
    ],
    "Network Speed": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Network Speed""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """(sum(rate(node_network_receive_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[1m])) by (instance)+sum(rate(node_network_transmit_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}])) by (instance))"""
        }
    ]
}
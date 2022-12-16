CLUSTER_MONITORING = {
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
    "Load Average": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Load Average""",
            "expr_units": """""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """node_load15{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        }
    ],
    "Memory Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """100 - (avg(node_memory_MemAvailable_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance) / avg(node_memory_MemTotal_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance) * 100)"""
        }
    ],
    "Disk I/O Read": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk I/O""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """sum(rate(node_disk_read_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (instance)"""
        }
    ],
    "Disk I/O Write": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk I/O""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """sum(rate(node_disk_written_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (instance)"""
        }
    ],
    "Disk Space Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk Space Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """100 - (sum(node_filesystem_free_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance) / sum(node_filesystem_size_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance) * 100)"""
        }
    ],
    "Network Received": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Network Received""",
            "expr_units": """bits/sec""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """sum(rate(node_network_receive_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}]) * 8) by (instance)"""
        }
    ],
    "Network Transmitted": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Network Transmitted""",
            "expr_units": """bits/sec""",
            "expr_tags_keys": """instance""",
            "expr_tags_values": """""",
            "expr_query": """sum(rate(node_network_transmit_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}]) * 8) by (instance)"""
        }
    ]
}
NODE_MONITORING = {
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
    "Core Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """CPU Usage""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """cpu""",
            "expr_tags_values": """""",
            "expr_query": """100 - (avg(rate(node_cpu_seconds_total{{job="node-exporter", mode="idle", {variable_key}=~"{variable_value}"}}[{rate_interval}])) by (instance, cpu) * 100)"""
            # "expr_query": """100 * ((1 - sum without (mode) (rate(node_cpu_seconds_total{{job="node-exporter", mode=~"idle|iowait|steal", {variable_key}=~"{variable_value}"}}[{rate_interval}]))) / ignoring(cpu) group_left count without (cpu, mode) (node_cpu_seconds_total{{job="node-exporter", mode="idle", {variable_key}=~"{variable_value}"}}))"""
        }
    ],
    "Load Average": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Load Average""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """1m load average""",
            "expr_query": """node_load1{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        },
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Load Average""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """5m load average""",
            "expr_query": """node_load5{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        },
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Load Average""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """15m load average""",
            "expr_query": """node_load15{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        },
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Load Average""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """logical cores""",
            "expr_query": """count(node_cpu_seconds_total{{job="node-exporter", {variable_key}=~"{variable_value}", mode="idle"}})"""
        }
    ],
    "Memory Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Usage""",
            "expr_units": """bytes""",
            "expr_tags_keys": """""",
            "expr_tags_values": """memory used""",
            "expr_query": """(node_memory_MemTotal_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}} - node_memory_MemFree_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}} - node_memory_Buffers_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}} - node_memory_Cached_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}})"""
        },
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Usage""",
            "expr_units": """bytes""",
            "expr_tags_keys": """""",
            "expr_tags_values": """memory buffers""",
            "expr_query": """node_memory_Buffers_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        },
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Usage""",
            "expr_units": """bytes""",
            "expr_tags_keys": """""",
            "expr_tags_values": """memory cached""",
            "expr_query": """node_memory_Cached_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        },
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Memory Usage""",
            "expr_units": """bytes""",
            "expr_tags_keys": """""",
            "expr_tags_values": """memory free""",
            "expr_query": """node_memory_MemFree_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}"""
        }
    ],
    "Disk I/O Read": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk I/O Read""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """device""",
            "expr_tags_values": """read""",
            "expr_query": """rate(node_disk_read_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device=~"(/dev/)?(mmcblk.p.+|nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+)"}}[{rate_interval}])"""
        }
    ],
    "Disk I/O Write": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk I/O Write""",
            "expr_units": """bytes/sec""",
            "expr_tags_keys": """device""",
            "expr_tags_values": """""",
            "expr_query": """rate(node_disk_written_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device=~"(/dev/)?(mmcblk.p.+|nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+)"}}[{rate_interval}])"""
        }
    ],
    "Disk Space Usage": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk Space Usage""",
            "expr_units": """bytes""",
            "expr_tags_keys": """mountpoint""",
            "expr_tags_values": """""",
            "expr_query": """sum by (instance, mountpoint) (node_filesystem_size_bytes{{job="node-exporter", {variable_key}=~"{variable_value}", fstype!=""}}) - sum by (instance, mountpoint) (node_filesystem_avail_bytes{{job="node-exporter", {variable_key}=~"{variable_value}", fstype!=""}})"""
        }
    ],
    "Disk Usage Percent": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Disk Usage Percent""",
            "expr_units": """Percent(0-100)""",
            "expr_tags_keys": """mountpoint""",
            "expr_tags_values": """""",
            "expr_query": """100 - (sum(node_filesystem_free_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance, mountpoint) / sum(node_filesystem_size_bytes{{job="node-exporter", {variable_key}=~"{variable_value}"}}) by (instance, mountpoint) * 100)"""
        }
    ],
    "Network Received": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Network Received""",
            "expr_units": """bits/sec""",
            "expr_tags_keys": """device""",
            "expr_tags_values": """""",
            "expr_query": """rate(node_network_receive_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}]) * 8"""
        }
    ],
    "Network Transmitted": [
        {
            "expr_type": """NodeExporter""",
            "expr_name": """Network Transmitted""",
            "expr_units": """bits/sec""",
            "expr_tags_keys": """device""",
            "expr_tags_values": """""",
            "expr_query": """rate(node_network_transmit_bytes_total{{job="node-exporter", {variable_key}=~"{variable_value}", device!="lo"}}[{rate_interval}]) * 8"""
        }
    ]
}
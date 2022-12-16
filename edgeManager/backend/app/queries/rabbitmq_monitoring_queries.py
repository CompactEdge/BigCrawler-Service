RABBITMQ_MONITORING = {
    "Publishers": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Publishers""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """""",
            "expr_query": """sum(rabbitmq_channels * on(instance) group_left(rabbitmq_cluster) rabbitmq_identity_info{{{variable_key}="{variable_value}"}}) - sum(rabbitmq_channel_consumers * on(instance) group_left(rabbitmq_cluster) rabbitmq_identity_info{{{variable_key}="{variable_value}"}})"""
        }
    ],
    "Consumers": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Consumers""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """""",
            "expr_query": """sum(rabbitmq_channel_consumers * on(instance) group_left(rabbitmq_cluster) rabbitmq_identity_info{{{variable_key}="{variable_value}"}})"""
        }
    ],
    "Channels": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Channels""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """""",
            "expr_query": """sum(rabbitmq_channels * on(instance) group_left(rabbitmq_cluster) rabbitmq_identity_info{{{variable_key}="{variable_value}"}})"""
        }
    ],
    "Nodes": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Nodes""",
            "expr_units": """""",
            "expr_tags_keys": """""",
            "expr_tags_values": """""",
            "expr_query": """sum(rabbitmq_build_info * on(instance) group_left(rabbitmq_cluster) rabbitmq_identity_info{{{variable_key}="{variable_value}"}})"""
        }
    ],
    "Messages Published": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Messages published""",
            "expr_units": """c/s""",
            "expr_tags_keys": """rabbitmq_node""",
            "expr_tags_values": """""",
            "expr_query": """sum(rate(rabbitmq_channel_messages_published_total[{rate_interval}]) * on(instance) group_left(rabbitmq_cluster, rabbitmq_node) rabbitmq_identity_info{{{variable_key}="{variable_value}"}}) by(rabbitmq_node)"""
        }
    ],
    "Messages Delivered": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Messages Delivered""",
            "expr_units": """c/s""",
            "expr_tags_keys": """rabbitmq_node""",
            "expr_tags_values": """""",
            "expr_query": """sum((rate(rabbitmq_channel_messages_delivered_total[{rate_interval}]) * on(instance) group_left(rabbitmq_cluster, rabbitmq_node) rabbitmq_identity_info{{{variable_key}="{variable_value}"}}) + (rate(rabbitmq_channel_messages_delivered_ack_total[{rate_interval}]) * on(instance) group_left(rabbitmq_cluster, rabbitmq_node) rabbitmq_identity_info{{{variable_key}="{variable_value}"}})) by(rabbitmq_node)"""
        }
    ],
    "Total Messages Published": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Total Messages published""",
            "expr_units": """c/s""",
            "expr_tags_keys": """""",
            "expr_tags_values": """Messages_published""",
            "expr_query": """sum(rate(rabbitmq_channel_messages_published_total[{rate_interval}]) * on(instance) group_left(rabbitmq_cluster, rabbitmq_node) rabbitmq_identity_info{{{variable_key}="{variable_value}"}})"""
        }
    ],
    "Total Messages Delivered": [
        {
            "expr_type": """edgemq-cluster-operator""",
            "expr_name": """Total Messages Delivered""",
            "expr_units": """c/s""",
            "expr_tags_keys": """""",
            "expr_tags_values": """Messages_delivered""",
            "expr_query": """sum((rate(rabbitmq_channel_messages_delivered_total[{rate_interval}]) * on(instance) group_left(rabbitmq_cluster, rabbitmq_node) rabbitmq_identity_info{{{variable_key}="{variable_value}"}}) + (rate(rabbitmq_channel_messages_delivered_ack_total[{rate_interval}]) * on(instance) group_left(rabbitmq_cluster, rabbitmq_node) rabbitmq_identity_info{{{variable_key}="{variable_value}"}}))"""
        }
    ],
}
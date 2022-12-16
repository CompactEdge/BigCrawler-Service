from app.model import elasticsearch_model
from flask_restx import Namespace, Resource

ns = Namespace("Elasticsearch api", description="Elasticsearch related operations")


@ns.route("/indices", methods=['GET'])
@ns.doc("list all indices in elasticsearch")
class ListDatabase(Resource):
    def get(self):
        """List all Indices"""

        return elasticsearch_model.list_indices()


@ns.route("/edge_sensor/item_name", methods=['GET'])
@ns.doc("list all item_name in edge sensor data")
class ListItemName(Resource):
    def get(self):
        """List all Item Name"""

        return elasticsearch_model.list_item_names()


@ns.route("/edge_sensor/device_id", methods=['GET'])
@ns.doc("list all device_id in edge sensor data")
class ListDeviceId(Resource):
    def get(self):
        """List all Device Id"""

        return elasticsearch_model.list_device_ids()


edge_sensor_doc_count_parser = ns.parser()
edge_sensor_doc_count_parser.add_argument('device_id', required=False, help='device id')
edge_sensor_doc_count_parser.add_argument('start_date', required=False, help='start date')
edge_sensor_doc_count_parser.add_argument('end_date', required=False, help='end date')
edge_sensor_doc_count_parser.add_argument('time_interval', required=False, help='time interval')

@ns.route("/edge_sensor/doc_count", methods=['GET'])
class EdgeSensorDocCount(Resource):
    @ns.doc("doc_count in edge sensor data")
    @ns.expect(edge_sensor_doc_count_parser)
    def get(self):
        """Get Doc Count"""
        args = edge_sensor_doc_count_parser.parse_args()

        return elasticsearch_model.get_edge_sensor_doc_count(args['device_id'], args['start_date'], args['end_date'], args['time_interval'])


edge_sensor_average_parser = ns.parser()
edge_sensor_average_parser.add_argument('item_name', required=True, help='item name')
edge_sensor_average_parser.add_argument('device_id', required=False, help='device id')
edge_sensor_average_parser.add_argument('start_date', required=False, help='start date')
edge_sensor_average_parser.add_argument('end_date', required=False, help='end date')
edge_sensor_average_parser.add_argument('time_interval', required=False, help='time interval')

@ns.route("/edge_sensor/average", methods=['GET'])
class EdgeSensorAverage(Resource):
    @ns.doc("sensor average in edge sensor data")
    @ns.expect(edge_sensor_average_parser)
    def get(self):
        """Get Average Count"""
        args = edge_sensor_average_parser.parse_args()

        return elasticsearch_model.get_edge_sensor_avg_count(args['item_name'], args['device_id'], args['start_date'], args['end_date'], args['time_interval'])


edge_sensor_all_parser = ns.parser()
edge_sensor_all_parser.add_argument('item_name', required=True, help='item name')
edge_sensor_all_parser.add_argument('device_id', required=False, help='device id')
edge_sensor_all_parser.add_argument('start_date', required=False, help='start date')
edge_sensor_all_parser.add_argument('end_date', required=False, help='end date')
edge_sensor_all_parser.add_argument('time_interval', required=False, help='time interval')

@ns.route("/edge_sensor/all", methods=['POST'])
class EdgeSensorAll(Resource):
    @ns.doc("get all data in edge sensor data")
    @ns.expect(edge_sensor_all_parser)
    def post(self):
        """Get Average Count"""
        args = edge_sensor_all_parser.parse_args()

        return elasticsearch_model.get_edge_sensor_all(args['item_name'], args['device_id'], args['start_date'], args['end_date'], args['time_interval'])

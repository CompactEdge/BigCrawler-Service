from .k8s_api import ns as k8s_ns
from .repos_api import ns as repos_ns

from flask import Blueprint
from flask_restx import Api

blueprint = Blueprint("restapi", __name__)

api = Api(
    blueprint, title="FLASK RESTX API", version="1.0", description="FLASK RESTX API "
)

api.add_namespace(k8s_ns, path="/k8s")
api.add_namespace(repos_ns, path="/repos")

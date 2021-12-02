from flask_restx import Namespace, Resource
from app.model import repos_model


ns = Namespace("Repository api")

@ns.route("/images", methods=['GET'])
@ns.doc("list all images in repository")
class imageList(Resource):
    def get(self):

        """List all Images"""
        return repos_model.list_images()


@ns.route("/tags", methods=['GET'])
@ns.doc("list all images in repository")
class tagList(Resource):
    def get(self):

        """tags in specific image"""
        return repos_model.list_tags()

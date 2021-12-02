from flask import Flask, send_from_directory
from app.api import blueprint as api
from flask_cors import CORS
import os


def create_app(config):
    app = Flask(__name__, static_folder=os.path.abspath(
        "../frontend/build/static"))
    CORS(app)
    app.config.from_object(config)

    # configure_database(app)

    app.register_blueprint(api, url_prefix="/rest/1.0")

    @app.route('/<path:path>')
    @app.route('/', defaults={'path': ''})
    def serve(path):
        path_dir = os.path.abspath("../frontend/build")  # path react build
        print(os.path.join(path_dir, path))

        if path != "" and os.path.exists(os.path.join(path_dir, path)):
            return send_from_directory(os.path.join(path_dir), path)
        else:
            return send_from_directory(os.path.join(path_dir), 'index.html')

    return app

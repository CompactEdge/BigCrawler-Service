import os

from app.api import blueprint as api
from flask import Flask, current_app, send_from_directory
from flask_cors import CORS
from utils.logger import Log


def create_app(config):
    app = Flask(__name__, static_folder=os.path.abspath("../frontend/build/static"))
    CORS(app)
    app.config.from_object(config)

    app.register_blueprint(api, url_prefix="/rest/1.0")

    with app.app_context():
        Log.init(logger_name=current_app.config['LOGGER_NAME'], log_level=current_app.config['LOG_LEVEL'], log_filepath=current_app.config['LOG_FILE'])

    @app.route('/<path:path>')
    @app.route('/', defaults={'path': ''})
    def serve(path):
        path_dir = os.path.abspath("../frontend/build")  # path react build

        if path != "" and os.path.exists(os.path.join(path_dir, path)):
            return send_from_directory(os.path.join(path_dir), path)
        else:
            return send_from_directory(os.path.join(path_dir), 'index.html')

    return app

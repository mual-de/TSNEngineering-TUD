"""
.. module:: tsn-configurator
    :platform: Linux
    :synopsis: start point for flask based web app
 
.. moduleauthor:: mual-de 
"""
import os

from flask import Flask, render_template



def create_app(test_config=None):
    """Create the web app
    Args:
    test_config: A given test configuration if needed
    """
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    from . import db
    db.init_app(app)

    from .engineering import configuration_tool
    app.register_blueprint(configuration_tool.bp)

    from .engineering.yang import yang_editor
    app.register_blueprint(yang_editor.bp)

    from .controlling import controller
    app.register_blueprint(controller.bp)

    from .controlling import router_controller
    app.register_blueprint(router_controller.bp)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, "UPLOADS")
    print(app.config['UPLOAD_FOLDER'])
    app.config['SESSION_TYPE'] = 'filesystem'
    app.secret_key = 'super secret key'

    # a simple page that says hello
    @app.route('/')
    def index():
        """Render the index page by request.

        Args:
            None
        """
        return render_template("index.html")

    return app
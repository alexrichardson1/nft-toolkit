"""
API - flask app factory creation.

Routes:
    - / : homepage
    - /api/price-prediction/{RARITY} : returns json of price or string Failed
"""
import os
from flask import Flask, Blueprint

price_blueprint = Blueprint('recipes', __name__, template_folder='templates')


@price_blueprint.route('/api/price-prediction/<string:rarity>')
def get_price_prediction(rarity):
    """
    Route:
        /api/price-prediction

    Args:
        rarity: rarity of the asset (between 0 - 100)

    Returns:
        Json file:
            {
                projected-price: int
            }
    """
    rarity = float(rarity)
    if 0 <= rarity <= 100:
        return {"price": rarity * 100}
    return "Failed"


@price_blueprint.route('/')
def home_page():
    """
    Route:
        /

    Returns:
        Empty Page.
    """

    return "This is the ML API server"


def create_app(test_config=None):
    """
    Creating an instance of the flask app

    Args:
        - test_config: Configuration for the test document.
    """
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(price_blueprint)

    return app

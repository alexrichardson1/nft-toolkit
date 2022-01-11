"""
API - flask app factory creation.
"""
import os
import pickle
import sys
from flask import Flask, Blueprint, request
from dotenv import load_dotenv
from hype_meter import HypeMeter
from flask_cors import CORS


load_dotenv()

sys.path.insert(1, './api/models')
price_blueprint = Blueprint('recipes', __name__, template_folder='templates')


@price_blueprint.route("/api/recommendations/<string:collection_name>")
def get_similar_collections(collection_name):
    """
    Route:
        /api/similar-collections

    Args:
        collection-name: string

    Returns:
        Json file:
            {
                collections: [(string, int)],
                hype: int,
                price: float
            }
    """
    with open('./api/collection_model', 'rb') as file:
        model = pickle.load(file)

    twitter = request.args.get('twitter-handle')
    reddit = request.args.get('reddit-handle')

    hype_meter = HypeMeter(collection_name, reddit, twitter)

    reddit_members = hype_meter.get_num_of_reddit_members()
    twitter_followers = hype_meter.get_num_of_twitter_followers()

    similar_collections = model.predict(
        collection_name, reddit_members, twitter_followers)

    if similar_collections is None:
        return {"collections": [], "hype": 0, "price": 0}

    hype = hype_meter.get_hype(similar_collections)
    price = hype_meter.get_recommended_price()

    return {"collections": hype_meter.similar_collections_formatted,
            "hype": hype * 100,
            "price": price}


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
    CORS(app)
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

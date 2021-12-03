"""
API - flask app factory creation.
"""
import os
import pickle
from flask import Flask, Blueprint
import pymongo
from dotenv import load_dotenv
import hype_meter
from flask_cors import CORS

load_dotenv()
price_blueprint = Blueprint('recipes', __name__, template_folder='templates')


@price_blueprint.route("/api/recommendations/" +
                       "<string:collection_name>/<string:twitter>/<string:reddit>")
def get_similar_collections(collection_name, twitter, reddit):
    """
    Route:
        /api/similar-collections

    Args:
        collection-name: string

    Returns:
        Json file:
            {
                names: [(string, int)],
                hype: int,
                price: float
            }
    """
    with open('api/collection_model', 'rb') as file:
        model = pickle.load(file)

    similar_collections = model.predict(collection_name)
    names = [{"name": i[0], "distance": i[1]}
             for i in similar_collections]

    if twitter == "":
        twitter = collection_name

    if reddit == "":
        reddit = collection_name

    hype = get_hype(similar_collections, twitter, reddit)
    price = get_price(similar_collections, hype)

    return {"names": names, "hype": hype * 100, "price": price}


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


def get_hype(names, twitter_handle, reddit_handle):
    """
    Returns hype from 0 to 1

    Args:
        - names: Names of similar collections
        - twitter_handle: Collection/Artists' twitter username
        - reddit_handle: Collection subreddit name
    """
    avg_score = sum([hype_meter.get_overall_score(collection)
                     for collection, _ in names]) / len(names)

    score_of_request = hype_meter.get_overall_score_using_handles(
        twitter_handle, reddit_handle)
    if score_of_request > avg_score:
        return 1
    return score_of_request / avg_score


def get_price(names, hype):
    """
    Returns predicted minting price

    Args:
        - names: Names of similar collections
        - hype: Hype from 0 to 1
    """
    similar_collections_avg_price = get_avg_price(names)
    return similar_collections_avg_price * hype * 0.1


def get_avg_price(names):
    # get the average sale price for each name
    # average that out
    """
    Returns average price of an asset from the list of similar collections

    Args:
        - names: Names of similar collections
    """
    client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
    collection = client.CollectionDB.collections
    prices = []
    for name in names:
        for document in collection.find({"name": name[0]}):
            prices.append(document["avg_sale_price"])
    if len(prices) == 0:
        return 0
    return sum(prices) / len(prices)

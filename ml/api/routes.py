"""
API - flask app factory creation.
"""
import os
import pickle
import sys
from flask import Flask, Blueprint, request
import pymongo
from dotenv import load_dotenv
import hype_meter
from flask_cors import CORS


load_dotenv()
sys.path.insert(1, 'api/models')
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
                names: [(string, int)],
                hype: int,
                price: float
            }
    """
    # If running locally change to sys.path.insert(1, 'api/collection_model')
    with open('api/collection_model', 'rb') as file:
        model = pickle.load(file)

    twitter = request.args.get('twitter-handle')
    reddit = request.args.get('reddit-handle')

    (reddit_members, subreddits) = hype_meter.get_num_of_reddit_members(reddit)
    twitter_followers = hype_meter.get_num_of_twitter_followers(twitter)

    similar_collections = model.predict(
        collection_name, reddit_members, twitter_followers)

    (hype, names) = get_hype(similar_collections, twitter, (reddit, subreddits))
    (price, final_similar_collections) = get_recommended_price(names, hype)

    return {"collections": final_similar_collections, "hype": hype * 100, "price": price}


@price_blueprint.route('/')
def home_page():
    """
    Route:
        /

    Returns:
        Empty Page.
    """

    return "This is the ML API server"


def get_collection():
    """
    Returns MondoDB's CollectionDB.collection_copy
    """
    client = pymongo.MongoClient(
        os.getenv("MONGO_STRING"))
    return client.CollectionDB.collection_copy


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


def get_hype(names, twitter_handle, reddit_data):
    """
    Returns hype from 0 to 1

    Args:
        - names: Names of similar collections
        - twitter_handle: Collection/Artists' twitter username
        - reddit_handle: Collection subreddit name
    """
    score_of_request = hype_meter.get_overall_score_using_handles(
        twitter_handle, reddit_data)

    stripped_names = []
    for collection in names:
        stripped_names.append({'name': collection['name'],
                               'score': collection['twitter_score'] + collection['reddit_score'],
                               'avg_sale_price': collection['avg_sale_price']})

    stripped_names = sorted(stripped_names, key=lambda d: abs(
        d['score'] - score_of_request), reverse=False)

    total = 0
    count = 0
    for collection in stripped_names[:6]:
        total += collection['score']
        count += 1

    avg_score = total

    if score_of_request > avg_score:
        return (1, stripped_names[:6])

    if avg_score == 0:
        return (0, stripped_names[:6])
    return (score_of_request / avg_score, stripped_names[:6])


def get_recommended_price(names, hype):
    """
    Returns predicted minting price

    Args:
        - names: Names of similar collections
        - hype: Hype from 0 to 1
    """
    (similar_collections_avg_price, similar_collections) = get_avg_price(names)
    if hype == 0:
        return (similar_collections_avg_price * 0.1, similar_collections)
    return (similar_collections_avg_price * hype * 0.1, similar_collections)


def get_avg_price(names):
    """
    Returns average price of an asset from the list of similar collections

    Args:
        - names: Names of similar collections
    """
    client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
    collection = client.CollectionDB.collection_copy
    prices = []
    collection_data = []
    for name in names:
        document = collection.find_one({"name": name['name']})
        prices.append(document["avg_sale_price"])
        collection_data.append(
            {"name": name['name'], "img": document['preview_img']})
    if len(prices) == 0:
        return (0, collection_data)
    return (sum(prices) / len(prices), collection_data)

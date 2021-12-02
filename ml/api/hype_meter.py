"""
Helper functions to calculate hype
"""

import os
import json
import requests
import pymongo
from dotenv import load_dotenv

load_dotenv()

# Initialise the Reddit Authentication
auth = requests.auth.HTTPBasicAuth(
    os.getenv("REDDIT_CLIENT_ID"), os.getenv("REDDIT_SECRET_ID"))
data = {'grant_type': 'password',
        'username': 'fooNFTProj',
        'password': os.getenv("REDDIT_PASS")}

headers = {'User-Agent': 'Hype-Calc/0.0.1'}
token_response = requests.post('https://www.reddit.com/api/v1/access_token',
                               auth=auth, data=data, headers=headers)
TOKEN = token_response.json()['access_token']
headers = {**headers, **{'Authorization': f"bearer {TOKEN}"}}


def get_score_from_twitter(collection_name):
    """
    Returns hype given a twitter handle
    """
    url = "https://api.twitter.com/1.1/users/show.json"
    querystring = {"screen_name": collection_name}
    twitter_headers = {"Authorization": "Bearer " +
                       os.getenv("TWITTER_BEARER_TOKEN")}
    response = requests.request(
        "GET", url, headers=twitter_headers, params=querystring)
    resp = json.loads(response.text)
    if "followers_count" in resp:
        return int(resp["followers_count"])
    return 0


def get_score_from_reddit(collection_name):
    """
    Returns hype given a reddit handle
    """
    params = {'query': collection_name}
    res = requests.post(
        'https://oauth.reddit.com/api/search_subreddits', headers=headers, params=params)
    if res.status_code != 200:
        return 0

    subreddits = [item['name'] for item in res.json()['subreddits']]
    total = 0
    for subreddit in subreddits:
        url = 'https://oauth.reddit.com/r/' + subreddit + '/about.json'
        res = requests.get(url, headers=headers)
        total += int(res.json()['data']['subscribers'])
    return total


def get_overall_score(collection_name):
    """
    Returns overall hype from Database or via requesting APIs
    """
    client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
    collection = client.CollectionDB.collections
    for document in collection.find({"name": collection_name}):
        return document["reddit_members"] + document["twitter_followers"]

    reddit = get_score_from_reddit(collection_name)
    twitter = get_score_from_twitter(collection_name)

    collection_data = [
        {
            'name': collection_name,
            "reddit_members": reddit,
            "twitter_followers": twitter
        },
    ]

    collection.insert_many(collection_data)

    return reddit + twitter


def get_overall_score_using_handles(twitter_handle, reddit_handle):
    """
    Returns overall hype via requesting APIs
    """
    return get_score_from_reddit(reddit_handle) + get_score_from_twitter(twitter_handle)

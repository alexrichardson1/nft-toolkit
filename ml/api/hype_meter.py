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


def get_subreddits_with_handle(reddit_handle):
    """
    Get all subreddits with a similar name as the reddit_handle
    """
    if reddit_handle is None:
        return []

    params = {'query': reddit_handle}
    res = requests.post(
        'https://oauth.reddit.com/api/search_subreddits',
        headers=headers,
        params=params)
    if res.status_code != 200:
        return []

    return res.json()['subreddits']


def get_num_of_reddit_members(reddit_handle):
    """
    Get number of subscribers to the subreddit
    """
    if reddit_handle is None:
        return (0, [])

    subreddits = get_subreddits_with_handle(reddit_handle=reddit_handle)
    if len(subreddits) == 0:
        return (0, None)
    return (int(subreddits[0]['subscriber_count']), subreddits)


def get_score_from_reddit(reddit_data):
    """
    Returns hype given a reddit handle
    """
    (handle, subreddits) = reddit_data

    if handle is None:
        return 0

    if subreddits is None:
        subreddits = get_subreddits_with_handle(reddit_handle=handle)

    total = 0
    for subreddit in subreddits:
        total += int(subreddit['subscriber_count']) + \
            int(subreddit['active_user_count'])
    return total


def get_num_of_twitter_followers(twitter_handle):
    """
    Get number of subscribers to the twitter
    """
    url = "https://api.twitter.com/1.1/users/show.json"
    querystring = {"screen_name": twitter_handle}
    twitter_headers = {"Authorization": "Bearer " +
                       os.getenv("TWITTER_BEARER_TOKEN")}
    response = requests.request(
        "GET", url, headers=twitter_headers, params=querystring)
    resp = json.loads(response.text)
    if "followers_count" in resp:
        return int(resp["followers_count"])
    return 0


def get_score_from_twitter(twitter_handle):
    """
    Returns hype given a twitter handle
    """
    if twitter_handle is None:
        return 0

    return get_num_of_twitter_followers(twitter_handle)


def get_overall_score(collection_name):
    """
    Returns overall hype from Database or via requesting APIs
    """
    client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
    collection = client.CollectionDB.collections
    for document in collection.find({"name": collection_name}):
        return document["reddit_members"] + document["twitter_followers"]

    reddit_score = get_score_from_reddit((collection_name, None))
    twitter_score = get_score_from_twitter(collection_name)
    return reddit_score + twitter_score


def get_overall_score_using_handles(twitter_handle, reddit_data):
    """
    Returns overall hype via requesting APIs
    """
    return get_score_from_reddit(reddit_data) + \
        get_score_from_twitter(twitter_handle)

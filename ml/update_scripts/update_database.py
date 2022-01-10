"""
Script to update the documents in the database
"""
import time
import sys
import os
import json
import requests

sys.path.insert(1, './api')
from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position


def get_similar_subreddits(collection_name_param_subreddits):
    """
    Fetches all similar subreddits
    """
    auth = requests.auth.HTTPBasicAuth(
        os.getenv("REDDIT_CLIENT_ID"), os.getenv("REDDIT_SECRET_ID"))
    data = {'grant_type': 'password',
            'username': 'fooNFTProj',
            'password': os.getenv("REDDIT_PASS")}

    reddit_headers = {'User-Agent': 'Hype-Calc/0.0.1'}
    token_response = requests.post('https://www.reddit.com/api/v1/access_token',
                                   auth=auth, data=data, headers=reddit_headers)
    token = token_response.json()['access_token']
    reddit_headers = {**reddit_headers, **{'Authorization': f"bearer {token}"}}

    params = {'query': collection_name_param_subreddits}
    res = requests.post(
        'https://oauth.reddit.com/api/search_subreddits',
        headers=reddit_headers,
        params=params)
    if res.status_code != 200:
        return []

    return res.json()['subreddits']


def score_reddit_activity_using_collection_name(collection_name_param_reddit_score):
    """
    Returns hype given a collection name
    """
    subreddits = get_similar_subreddits(collection_name_param_reddit_score)
    total = 0
    for subreddit in subreddits:
        total += int(subreddit['subscriber_count']) + \
            int(subreddit['active_user_count'])
    return total


def score_twitter_activity_using_collection_name(collection_name_twitter_score):
    """
    Returns number of followers for Twitter score
    """
    twitter_url = "https://api.twitter.com/1.1/users/show.json"
    querystring = {"screen_name": collection_name_twitter_score}
    twitter_headers = {"Authorization": "Bearer " +
                       os.getenv("TWITTER_BEARER_TOKEN")}
    twitter_response = requests.request(
        "GET", twitter_url, headers=twitter_headers, params=querystring)
    resp = json.loads(twitter_response.text)
    if "followers_count" in resp:
        return int(resp["followers_count"])
    return 0


collection = get_collection()
failed_collections = []

for document in collection.find():
    collection_name = document['name']
    print("Getting scores for : " + collection_name)
    REDDIT = score_reddit_activity_using_collection_name(collection_name)
    TWITTER = score_twitter_activity_using_collection_name(collection_name)
    print("Requesting collection data from Opensea for : " + collection_name)
    img = document['preview_img']
    avg_price = document['avg_sale_price']
    volume = document['volume']

    opensea_url = "https://api.opensea.io/api/v1/collection/%s" % collection_name
    headers = {"Accept": "application/json"}
    response = requests.request("GET", opensea_url, headers=headers)
    if response.status_code == 200:
        img = response.json()['collection']['image_url']
        avg_price = response.json()['collection']['stats']['average_price']
        volume = response.json()['collection']['stats']['total_volume']
        print("Successfully requested Opensea for collection: " + collection_name)

    else:
        failed_collections.append(collection_name)
        print("Failed to request Opensea for collection: " + collection_name)

    collection.update_one({"name": collection_name},
                          {'$set': {'reddit_score': REDDIT,
                                    'twitter_score': TWITTER,
                                    'preview_img': img,
                                    'avg_sale_price': avg_price,
                                    'volume': volume
                                    }
                           })
    time.sleep(4)

print("Update Complete with the following collections failed: ")
print(failed_collections)

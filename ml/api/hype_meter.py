"""
Helper functions to calculate hype
"""

import os
import json
import requests
import pymongo
from dotenv import load_dotenv

load_dotenv()


class HypeMeter():
    """
    Object class to get hype using collection names, reddit handle and twitter handle
    """

    def __init__(self, collection_name, reddit_handle, twitter_handle):
        self.reddit_handle = reddit_handle
        self.twitter_handle = twitter_handle
        self.subreddits = None
        self.collection_name = collection_name
        self.hype = None
        self.similar_collections = None
        self.similar_collections_formatted = None

    def get_subreddits_with_handle(self):
        """
        Get all subreddits with a similar name as the reddit_handle
        """
        if self.reddit_handle is None:
            self.subreddits = []
            return self.subreddits

        # Initialise the Reddit Authentication
        auth = requests.auth.HTTPBasicAuth(
            os.getenv("REDDIT_CLIENT_ID"), os.getenv("REDDIT_SECRET_ID"))
        data = {'grant_type': 'password',
                'username': 'fooNFTProj',
                'password': os.getenv("REDDIT_PASS")}

        headers = {'User-Agent': 'Hype-Calc/0.0.1'}
        token_response = requests.post('https://www.reddit.com/api/v1/access_token',
                                       auth=auth, data=data, headers=headers)
        token = token_response.json()['access_token']
        headers = {**headers, **{'Authorization': f"bearer {token}"}}

        params = {'query': self.reddit_handle}
        res = requests.post(
            'https://oauth.reddit.com/api/search_subreddits',
            headers=headers,
            params=params)
        if res.status_code != 200:
            self.subreddits = []
            return self.subreddits

        resp = json.loads(res.text)
        if "subreddits" in resp:
            self.subreddits = resp["subreddits"]
        else:
            self.subreddits = []
        return self.subreddits

    def get_num_of_reddit_members(self):
        """
        Get number of subscribers to the subreddit
        """
        if self.reddit_handle is None:
            return 0

        subreddits = self.get_subreddits_with_handle()
        if len(subreddits) == 0:
            return 0

        return \
            int(subreddits[0]['subscriber_count']) if (
                'subscriber_count' in subreddits[0]) else 0

    def get_score_from_reddit(self):
        """
        Returns hype given a reddit handle
        """

        if self.reddit_handle is None:
            return 0

        if self.subreddits is None:
            self.get_subreddits_with_handle()

        total = 0
        for subreddit in self.subreddits:
            total += \
                (int(subreddit['subscriber_count']) if 'subscriber_count' in subreddit else 0) + \
                (int(subreddit['active_user_count'])
                 if 'active_user_count' in subreddit else 0)
        return total

    def get_num_of_twitter_followers(self):
        """
        Get number of subscribers to the twitter
        """

        if self.twitter_handle is None:
            return 0

        url = "https://api.twitter.com/1.1/users/show.json"
        querystring = {"screen_name": self.twitter_handle}
        twitter_headers = {"Authorization": "Bearer " +
                           os.getenv("TWITTER_BEARER_TOKEN")}
        response = requests.request(
            "GET", url, headers=twitter_headers, params=querystring)

        if response.status_code != 200:
            return 0

        resp = json.loads(response.text)
        if "followers_count" in resp:
            return int(resp["followers_count"])
        return 0

    def get_score_from_twitter(self):
        """
        Returns hype given a twitter handle
        """
        return self.get_num_of_twitter_followers()

    def get_overall_score(self):
        """
        Returns overall hype from Database or via requesting APIs
        """
        client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
        collection = client.CollectionDB.collections
        for document in collection.find({"name": self.collection_name}):
            return document["reddit_score"] + document["twitter_score"]

        reddit_score = self.get_score_from_reddit()
        twitter_score = self.get_score_from_twitter()
        return reddit_score + twitter_score

    def get_overall_score_using_handles(self):
        """
        Returns overall hype via requesting APIs
        """
        return self.get_score_from_reddit() + \
            self.get_score_from_twitter()

    def get_hype(self, similar_collections):
        """
        Returns evaluation of hype using other similar collections
        """
        score_of_request = self.get_overall_score_using_handles()
        self.similar_collections = similar_collections

        total = 0
        count = 0
        for collection in similar_collections:
            total += collection['twitter_score'] + collection['reddit_score']
            count += 1

        avg_score = total / count

        if score_of_request > avg_score:
            self.hype = 1
            return self.hype

        if avg_score == 0:
            self.hype = 0
            return self.hype

        self.hype = score_of_request / avg_score
        return self.hype

    def get_recommended_price(self):
        """
        Returns predicted minting price

        Args:
            - collections: Names of similar collections
        """
        similar_collections_avg_price = self.get_avg_price()
        if self.hype == 0:
            return similar_collections_avg_price * 0.1
        return similar_collections_avg_price * self.hype * 0.1

    def get_avg_price(self):
        """
        Returns average price of an asset from the list of similar collections

        Args:
            - collections: Names of similar collections
        """
        db_collection = get_collection()
        prices = []
        collection_data = []
        for collection in self.similar_collections:
            document = db_collection.find_one({'name': collection['name']})
            prices.append(document["avg_sale_price"])
            collection_data.append(
                {"name": document['name'], "img": document['preview_img']})

        self.similar_collections_formatted = collection_data
        if len(prices) == 0:
            return 0
        return sum(prices) / len(prices)


def get_collection():
    """
    Returns MondoDB's CollectionDB.collection_copy
    """
    client = pymongo.MongoClient(
        os.getenv("MONGO_STRING"))
    return client.CollectionDB.collection_copy

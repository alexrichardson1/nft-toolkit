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
        return int(subreddits[0]['subscriber_count'])

    def get_score_from_reddit(self):
        """
        Returns hype given a reddit handle
        """

        if self.reddit_handle is None:
            return 0

        if self.subreddits is None:
            self.subreddits = self.get_subreddits_with_handle()

        total = 0
        for subreddit in self.subreddits:
            total += int(subreddit['subscriber_count']) + \
                int(subreddit['active_user_count'])
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
        if self.twitter_handle is None:
            return 0

        return self.get_num_of_twitter_followers()

    def get_overall_score(self):
        """
        Returns overall hype from Database or via requesting APIs
        """
        client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
        collection = client.CollectionDB.collections
        for document in collection.find({"name": self.collection_name}):
            return document["reddit_members"] + document["twitter_followers"]

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

        total = 0
        count = 0
        for collection in similar_collections:
            total += collection['twitter_score'] + collection['reddit_score']
            count += 1

        avg_score = total / count

        if score_of_request > avg_score:
            return 1

        if avg_score == 0:
            return 0
        return score_of_request / avg_score

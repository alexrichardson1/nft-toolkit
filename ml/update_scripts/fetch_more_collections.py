"""
Script to add more collections to the database
"""
import time
import sys
import requests

sys.path.insert(1, '../api')
from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position


db_collection = get_collection()
NUMBER_OF_COLLECTIONS_TO_FETCH = 500
COLLECTIONS_FETCH_LIMIT = 300
FAILURE_LIMIT = 3

NUMBER_OF_FAILED_REQUESTS = 0
OFFSET_COUNTER = 0
collection_names = []

while (len(collection_names) < NUMBER_OF_COLLECTIONS_TO_FETCH and
       NUMBER_OF_FAILED_REQUESTS < FAILURE_LIMIT):
    url = ("https://api.opensea.io/api/v1/collections?" +
           f"offset={OFFSET_COUNTER}&limit={COLLECTIONS_FETCH_LIMIT}")
    headers = {"Accept": "application/json"}
    response = requests.request("GET", url, headers=headers)
    if response.status_code != 200:
        NUMBER_OF_FAILED_REQUESTS += 1
        print("Failed requested Opensea for more collections")
    else:
        OFFSET_COUNTER += len(response.json()['collections'])
        collection_names += [{'name': collection['name'],
                              'avg_sale_price': collection['stats']['average_price'],
                              'volume': collection['stats']['total_volume'],
                              'preview_img': collection['image_url'],
                              'reddit_score': 0,
                              'twitter_score': 0
                              } for collection in response.json()['collections']
                             if len(list(db_collection.find({'name': collection['name']}))) == 0]

    time.sleep(4)

if len(collection_names) == 0:
    print("Failed to fetch")
else:
    db_collection.insert_many(collection_names)
    print(
        f"Successfully added {len(collection_names)} collections to the database")

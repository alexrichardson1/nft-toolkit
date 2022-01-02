"""
Script to update the documents in the database
"""
import time
import sys
import requests

# If running locally change to sys.path.insert(1, 'api')
sys.path.insert(1, '/api')
from hype_meter import get_score_from_reddit, get_score_from_twitter  # noqa # pylint:disable=import-error, wrong-import-position
from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position


collection = get_collection()
failed_collections = []

for document in collection.find():
    collection_name = document['name']
    print("Getting scores for : " + collection_name)
    REDDIT = get_score_from_reddit((collection_name, None))
    TWITTER = get_score_from_twitter(collection_name)
    print("Requesting collection data from Opensea for : " + collection_name)
    img = document['preview_img']
    avg_price = document['avg_sale_price']
    volume = document['volume']

    url = "https://api.opensea.io/api/v1/collection/%s" % collection_name
    headers = {"Accept": "application/json"}
    response = requests.request("GET", url, headers=headers)
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

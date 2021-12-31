"""
Script to update the documents in the database
"""
import os
import time
import pymongo
from dotenv import load_dotenv
import hype_meter
import requests


load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
collection = client.CollectionDB.collection_copy

failed_collections = []

for document in collection.find():
    collection_name = document['name']
    print("Getting scores for : " + collection_name)
    reddit = hype_meter.get_score_from_reddit((collection_name, None))
    twitter = hype_meter.get_score_from_twitter(collection_name)

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
                          {'$set': {'reddit_score': reddit,
                                    'twitter_score': twitter,
                                    'preview_img': img,
                                    'avg_sale_price': avg_price,
                                    'volume': volume
                                    }
                           })
    time.sleep(4)

print("Update Complete with the following collections failed: ")
print(failed_collections)

"""
Script to refresh the database
"""
import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
collection = client.CollectionDB.collections
collection_copy = client.CollectionDB.collection_copy

collection_copy.delete_many({})

for document in collection.find():
    collection_name = document['name']
    query = {'name': collection_name}
    print(query)

    to_insert = {
        'name': collection_name,
        'reddit_score': 0,
        'twitter_score': 0,
        'avg_sale_price': 0,
        'volume': 0,
        'preview_img': ""
    }

    collection_copy.insert_one(to_insert)

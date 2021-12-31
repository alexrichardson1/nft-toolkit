"""
Script to remove duplicates in the database
"""
import os
import pymongo
from dotenv import load_dotenv


load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
collection = client.CollectionDB.collection_copy

for document in collection.find():
    collection_name = document['name']
    query = {'name': collection_name}
    while len(list(collection.find(query))) != 1:
        print("Deleting " + collection_name)
        collection.delete_one(query)

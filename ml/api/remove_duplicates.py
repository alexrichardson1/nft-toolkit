"""
Script to remove duplicates in the database
"""
from dotenv import load_dotenv
from routes import get_collection


load_dotenv()

collection = get_collection()

for document in collection.find():
    collection_name = document['name']
    query = {'name': collection_name}
    while len(list(collection.find(query))) != 1:
        print("Deleting " + collection_name)
        collection.delete_one(query)

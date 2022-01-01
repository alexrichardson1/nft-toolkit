"""
Script to remove duplicates in the database
"""
import sys

sys.path.insert(1, '../api')
from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position

collection = get_collection()

for document in collection.find():
    collection_name = document['name']
    query = {'name': collection_name}
    while len(list(collection.find(query))) != 1:
        print("Deleting " + collection_name)
        collection.delete_one(query)

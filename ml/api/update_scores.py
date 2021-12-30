"""
Script to update scores in the database
"""
import os
import pymongo
import hype_meter

client = pymongo.MongoClient(os.getenv("MONGO_STRING"))
collection = client.CollectionDB.collections

print(collection)
to_insert = []

for document in collection.find():
    collection_name = document['name']
    print("Getting scores for : " + collection_name)
    reddit = hype_meter.get_score_from_reddit((collection_name, None))
    twitter = hype_meter.get_score_from_twitter(collection_name)

    to_insert.append({
        'name': collection_name,
        'reddit_members': reddit,
        'twitter_followers': twitter
    })

print("Inserting into the database...")

collection.insert_many(to_insert)
print("Finished.")

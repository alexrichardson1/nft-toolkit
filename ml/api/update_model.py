"""
Script to update collection_model
"""

import os
import prediction_model
import pymongo
from dotenv import load_dotenv
import numpy as np


load_dotenv()

key = os.getenv("MONGO_STRING")
client = pymongo.MongoClient(key)
collection = client.CollectionDB.collections
collections = np.array([{"name": doc["name"],
                         "reddit_members": doc["reddit_members"],
                         "twitter_followers": doc["twitter_followers"]}
                        for doc in collection.find({})])

model = prediction_model.PredictionModel(collections)
print("Training...")
model.train()
print("Training Complete")
model.save_model()
print("Saved Model")

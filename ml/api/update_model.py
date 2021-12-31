"""
Script to update collection_model
"""

import os
import prediction_model
import pymongo
from dotenv import load_dotenv


load_dotenv()

key = os.getenv("MONGO_STRING")
client = pymongo.MongoClient(key)
db_collection = client.CollectionDB.collection_copy
collections = [{"name": doc["name"],
                "reddit_score": doc["reddit_score"],
                "twitter_score": doc["twitter_score"],
                "avg_sale_price": doc["avg_sale_price"]}
               for doc in db_collection.find({})]

model = prediction_model.PredictionModel(collections)
print("Training...")
model.train()
print("Training Complete")
print("Fetching Accuracy")
mse = model.get_mse()
print("MSE is " + str(mse))
model.save_model()
print("Saved Model")

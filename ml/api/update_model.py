"""
Script to update collection_model
"""

import pickle
from routes import get_collection
from dotenv import load_dotenv


load_dotenv()

db_collection = get_collection()
collections = [{"name": doc["name"],
                "reddit_score": doc["reddit_score"],
                "twitter_score": doc["twitter_score"],
                "avg_sale_price": doc["avg_sale_price"]}
               for doc in db_collection.find({})]


with open('./collection_model', 'rb') as file:
    model = pickle.load(file)

model.set_collections(collections)
print("Training...")
model.train()
print("Training Complete")
print("Fetching Accuracy")
mse = model.get_mse()
print("MSE is " + str(mse))
model.save_model()
print("Saved Model")

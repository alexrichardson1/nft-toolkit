"""
Script to update collection_model
"""

import pickle
import sys

# If running locally change to sys.path.insert(1, 'api')
sys.path.insert(1, './api')
sys.path.insert(1, './api/models')
from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position


db_collection = get_collection()
collections = [{"name": doc["name"],
                "reddit_score": doc["reddit_score"],
                "twitter_score": doc["twitter_score"],
                "avg_sale_price": doc["avg_sale_price"]}
               for doc in db_collection.find({})]


# If running locally change to with open('api/collection_model', 'rb') as file:
with open('./api/collection_model', 'rb') as file:
    model = pickle.load(file)

model.set_collections(collections)
print("Training...")
model.train()
print("Training Complete")
model.save_model()
print("Saved Model")

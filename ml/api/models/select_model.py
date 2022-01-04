"""
Script to find best model
"""

import sys
from prediction_model_affinity_prop_name_score import PredictionModelAffinityPropagationNamingScore
from prediction_model_affinity_prop_name import PredictionModelAffinityPropagationNaming
from prediction_model_kmeans import PredictionModelKMeans
from prediction_model_nearest_neighbors import PredictionModelNearestNeighbors

sys.path.insert(1, "api/")

from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position

db_collection = get_collection()
collections = db_collection.find({})

model1 = PredictionModelAffinityPropagationNamingScore(list(collections), 0.4)
model2 = PredictionModelAffinityPropagationNaming(list(collections))
model3 = PredictionModelKMeans(list(collections))
model4 = PredictionModelNearestNeighbors(list(collections))

model1.preprocess_data()
model1.train()

model2.preprocess_data()
model2.train()

model3.preprocess_data()
model3.train()

model2.save_model()

model4.preprocess_data()
model4.train()

print(f"Model1: RMSE is {model1.get_rmse()}")
print(f"Model2: RMSE is {model2.get_rmse()}")
print(f"Model3: RMSE is {model3.get_rmse()}")
print(f"Model4: RMSE is {model4.get_rmse()}")

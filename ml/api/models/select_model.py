"""
Script to find best model
"""

import math
import sys
import threading
from prediction_model_affinity_prop_name_score import PredictionModelAffinityPropagationNamingScore
from prediction_model_affinity_prop_name import PredictionModelAffinityPropagationNaming
from prediction_model_kmeans import PredictionModelKMeans
from prediction_model_nearest_neighbors import PredictionModelNearestNeighbors

sys.path.insert(1, "api/")

from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position

db_collection = get_collection()
collections = db_collection.find({})
collections = list(collections)

model1 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.4, score_scaler_func=math.log10)
model2 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.4, score_scaler_func=math.log2)
model3 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.4, score_scaler_func=lambda num: num)
model4 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.7, score_scaler_func=math.log10)
model5 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.7, score_scaler_func=math.log2)
model6 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.2, score_scaler_func=lambda num: num)
model7 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.2, score_scaler_func=math.log10)
model8 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.2, score_scaler_func=math.log2)
model9 = PredictionModelAffinityPropagationNamingScore(
    collections, levenshtein_scale=0.2, score_scaler_func=lambda num: num)

model10 = PredictionModelAffinityPropagationNaming(collections)

affinity_models = [model1, model2, model3, model4,
                   model5, model6, model7, model8, model9, model10]

model11 = PredictionModelKMeans(collections, n_clusters=10)
model12 = PredictionModelKMeans(collections, n_clusters=20)
model13 = PredictionModelKMeans(collections, n_clusters=30)
model14 = PredictionModelKMeans(collections, n_clusters=40)

m = PredictionModelKMeans(collections=collections, n_clusters=32)
m.preprocess_data()
m.train()
print(m.get_rmse())

k_means_models = [model11, model12, model13, model14]

model15 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.25, score_scaler=1)
model16 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.5, score_scaler=1)
model17 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.75, score_scaler=1)
model18 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=1, score_scaler=1)
model19 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.25, score_scaler=0.75)
model20 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.5, score_scaler=0.75)
model21 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.75, score_scaler=0.75)
model22 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=1, score_scaler=0.75)
model23 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.25, score_scaler=0.5)
model24 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.5, score_scaler=0.5)
model25 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.75, score_scaler=0.5)
model26 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=1, score_scaler=0.5)
model27 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.25, score_scaler=0.25)
model28 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.5, score_scaler=0.25)
model29 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=0.75, score_scaler=0.25)
model30 = PredictionModelNearestNeighbors(
    collections, levenshtein_scale=1, score_scaler=0.25)

nn_models = [model15, model16, model17, model18, model19, model20, model21, model22, model23,
             model24, model25, model26, model27, model28, model29, model30]


def get_rmse_for_models(name, models):
    """
    Thread body to get all RMSEs
    """
    for i, model in enumerate(models):
        model.preprocess_data()
        model.train()
        rmse = model.get_rmse()
        print(f"{name}: RMSE for model number {i+1} is {rmse}")


thread_affinity = threading.Thread(
    target=get_rmse_for_models, args=("AFFINITY", affinity_models,))
thread_kmeans = threading.Thread(
    target=get_rmse_for_models, args=("KMEANS", k_means_models,))
thread_nn = threading.Thread(
    target=get_rmse_for_models, args=("NEAREST NEIGHBORS", nn_models,))

thread_affinity.start()
thread_kmeans.start()
thread_nn.start()

thread_affinity.join()
thread_kmeans.join()
thread_nn.join()

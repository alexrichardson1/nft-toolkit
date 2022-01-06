"""
Script to find best model
"""

import math
import sys
import threading
import numpy as np
from prediction_model_affinity_prop_name_score import PredictionModelAffinityPropagationNamingScore
from prediction_model_affinity_prop_name import PredictionModelAffinityPropagationNaming
from prediction_model_kmeans import PredictionModelKMeans
from prediction_model_nearest_neighbors import PredictionModelNearestNeighbors
from prediction_model_birch import PredictionModelBirch

sys.path.insert(1, "api/")

from routes import get_collection  # noqa # pylint:disable=import-error, wrong-import-position

db_collection = get_collection()
collections = db_collection.find({})
collections = list(collections)


def get_rmse_for_affinity_name_score():
    """
    Thread body to get all RMSEs using PredictionModelAffinityPropagationNamingScore
    """
    for lev_scale in np.arange(0, 2, 0.2):
        model1 = PredictionModelAffinityPropagationNamingScore(
            collections, lev_scale, math.log10)
        model2 = PredictionModelAffinityPropagationNamingScore(
            collections, lev_scale, np.sqrt)
        model3 = PredictionModelAffinityPropagationNamingScore(
            collections, lev_scale, lambda n: n)
        model1.preprocess_data()
        model2.preprocess_data()
        model3.preprocess_data()
        model1.train()
        model2.train()
        model3.train()
        print(
            f"AFFINITY WITH SCORE: lev_scale={lev_scale}," +
            f" scaler_func={math.log} ----- RMSE:{model1.get_rmse()}")
        print(
            f"AFFINITY WITH SCORE: lev_scale={lev_scale}," +
            f" scaler_func={np.sqrt} ----- RMSE:{model2.get_rmse()}")
        print(
            f"AFFINITY WITH SCORE: lev_scale={lev_scale}," +
            f" scaler_func={(lambda n: n)} ----- RMSE:{model3.get_rmse()}")


def get_rmse_for_affinity_name():
    """
    Thread body to get all RMSEs using PredictionModelAffinityPropagationNaming
    """
    model1 = PredictionModelAffinityPropagationNaming(collections)
    model1.preprocess_data()
    model1.train()
    print(f"AFFINITY ---- RMSE:{model1.get_rmse()}")


def get_rmse_for_kmeans():
    """
    Thread body to get all RMSEs using PredictionModelKMeans
    """
    for n_clusters in range(3, 50, 3):
        model = PredictionModelKMeans(collections, n_clusters=n_clusters)
        model.preprocess_data()
        model.train()
        print(f"KMEANS: n_clusters={n_clusters} ----- RMSE:{model.get_rmse()}")


def get_rmse_for_nn():
    """
    Thread body to get all RMSEs using PredictionModelNearestNeighbors
    """
    for lev_scale in np.arange(0.5, 2.5, 0.5):
        for score_scale in np.arange(0.5, 3, 0.5):
            model = PredictionModelNearestNeighbors(
                collections, lev_scale, score_scale)
            model.preprocess_data()
            model.train()
            print(
                f"NEAREST NEIGHBORS: lev_scale={lev_scale}" +
                f" score_scale={score_scale} ----- RMSE:{model.get_rmse()}")


def get_rmse_for_birch():
    """
    Thread body to get all RMSEs using PredictionModelBirch
    """
    for n_clusters in range(1, 15):
        model = PredictionModelBirch(collections, n_clusters=n_clusters)
        model.preprocess_data()
        model.train()
        print(f"BIRCH: n_clusters={n_clusters} ----- RMSE:{model.get_rmse()}")


get_rmse_for_affinity_name()

thread_affinity_name_score = threading.Thread(
    target=get_rmse_for_affinity_name_score)
thread_kmeans = threading.Thread(target=get_rmse_for_kmeans)
thread_nn = threading.Thread(target=get_rmse_for_nn)
thread_birch = threading.Thread(target=get_rmse_for_birch)

thread_affinity_name_score.start()
thread_kmeans.start()
thread_nn.start()
thread_birch.start()

thread_affinity_name_score.join()
thread_kmeans.join()
thread_nn.join()
thread_birch.join()

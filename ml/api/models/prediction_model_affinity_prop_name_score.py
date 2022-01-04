"""
Model for clustering collections
"""

import math
import sys
import distance
from sklearn.cluster import AffinityPropagation
import numpy as np
import prediction_model_abstract


class PredictionModelAffinityPropagationNamingScore(prediction_model_abstract.PredictionModel):
    """
    Model for clustering collections
    """

    # pylint:disable=too-many-instance-attributes
    def __init__(self, collections, levenshtein_scale=0.5, score_scaler_func=math.log10):  # pylint:disable=super-init-not-called, too-many-instance-attributes
        self.collections = np.array(
            [col for col in collections if col['avg_sale_price'] != 0])
        np.random.shuffle(self.collections)
        split_idx_training = int(0.6 * len(self.collections))
        split_idx_validation = int(0.8 * len(self.collections))
        self.collections_training = self.collections[:split_idx_training]
        self.collections_validation = self.collections[split_idx_training:split_idx_validation]
        self.collections_testing = self.collections[split_idx_validation:]
        self.lev_similarity = []
        self.model = None
        self.levenshtein_scale = levenshtein_scale
        self.score_scaler_func = score_scaler_func

    def set_collections(self, collections):
        """
        Set the collections numpy array
        """
        self.collections = np.array(
            [col for col in collections if col['avg_sale_price'] != 0])
        np.random.shuffle(self.collections)
        split_idx_training = int(0.6 * len(self.collections))
        split_idx_validation = int(0.8 * len(self.collections))
        self.collections_training = self.collections[:split_idx_training]
        self.collections_validation = self.collections[split_idx_training:split_idx_validation]
        self.collections_testing = self.collections[split_idx_validation:]

    def train(self, damping=0.5, max_iter=1000, use_all_data=False):   # pylint:disable=arguments-differ
        """
        Train model for clustering collections
        """
        if use_all_data:
            dataset = self.collections
        else:
            dataset = self.collections_training

        self.lev_similarity = -1 * np.array([[
            round(self.levenshtein_scale * distance.levenshtein(c1["name"], c2["name"])) +
            self.score_scaler_func(abs(c1["reddit_score"] - c2["reddit_score"]) + 1) +
            self.score_scaler_func(
                abs(c1["twitter_score"] - c2["twitter_score"]) + 1)
            for c1 in dataset] for c2 in dataset])
        self.model = AffinityPropagation(
            affinity="precomputed",
            damping=damping,
            max_iter=max_iter,
            verbose=True)
        self.model.fit(self.lev_similarity)

    def predict(self, word, reddit_score=0, twitter_score=0):
        """
        Predict using Model
        """
        try:
            lev_similarity = np.array([
                (self.levenshtein_scale * distance.levenshtein(
                    self.collections_training[self.model.cluster_centers_indices_[
                        cluster_id]]["name"], word)) +
                self.score_scaler_func(np.square(self.collections_training[
                    self.model.cluster_centers_indices_[cluster_id]]["reddit_score"] -
                    reddit_score) + 1) +
                self.score_scaler_func(np.square(self.collections_training[
                    self.model.cluster_centers_indices_[cluster_id]]["twitter_score"] -
                    twitter_score) + 1)
                for cluster_id in np.unique(self.model.labels_)])
            (index, _) = min(enumerate(lev_similarity), key=lambda x: x[1])
            collections = list(dict((v['name'], v) for v in self.collections_training[np.nonzero(
                self.model.labels_ == np.unique(self.model.labels_)[index])]).values())
            return collections[:6]
        except IndexError:
            return None

    def preprocess_data(self):
        split_idx_training = int(0.6 * len(self.collections))
        split_idx_validation = int(0.8 * len(self.collections))
        self.collections_training = self.collections[:split_idx_training]
        self.collections_validation = self.collections[split_idx_training:split_idx_validation]
        self.collections_testing = self.collections[split_idx_validation:]

    def get_rmse(self):
        """
        Gets mean squared error of model
        """
        mse = 0
        total_validated = 0
        for collection in self.collections_validation:
            predictions = self.predict(
                collection['name'], collection['reddit_score'], collection['twitter_score'])
            if predictions is None:
                pred_avg_price = sys.maxsize
            else:
                pred_avg_price = sum([col['avg_sale_price']
                                      for col in predictions]) / len(predictions)
            total_validated += 1
            mse += math.pow(pred_avg_price - collection['avg_sale_price'], 2)
        return math.sqrt(mse / total_validated)

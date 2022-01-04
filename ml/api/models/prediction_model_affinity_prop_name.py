"""
Model for clustering collections
"""

import math
import distance
from sklearn.cluster import AffinityPropagation
import numpy as np
import prediction_model_abstract


class PredictionModelAffinityPropagationNaming(prediction_model_abstract.PredictionModel):
    """
    Model for clustering collections
    """

    def __init__(self, collections):  # pylint:disable=super-init-not-called
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
            distance.levenshtein(c1["name"], c2["name"]) for c1 in dataset] for c2 in dataset])

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
        lev_similarity = np.array([
            distance.levenshtein(self.collections_training[
                self.model.cluster_centers_indices_[cluster_id]]["name"], word)
            for cluster_id in np.unique(self.model.labels_)])
        (index, _) = min(enumerate(lev_similarity), key=lambda x: x[1])
        collections = list(dict((v['name'], v) for v in self.collections_training[np.nonzero(
            self.model.labels_ == np.unique(self.model.labels_)[index])]).values())
        return collections[:6]

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
            pred_avg_price = sum([col['avg_sale_price']
                                  for col in predictions]) / len(predictions)
            total_validated += 1
            mse += math.pow(pred_avg_price - collection['avg_sale_price'], 2)
        return math.sqrt(mse / total_validated)

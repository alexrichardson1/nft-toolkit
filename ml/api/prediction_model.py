"""
Model for clustering collections
"""

import math
import pickle
import distance
from sklearn.cluster import AffinityPropagation
import numpy as np


class PredictionModel:
    """
    Model for clustering collections
    """

    def __init__(self, collections):
        self.collections = np.array(collections)
        np.random.shuffle(self.collections)
        split_idx = int(0.8 * len(self.collections))
        self.collections_training = self.collections[:split_idx]
        self.collections_testing = self.collections[split_idx:]
        self.lev_similarity = []
        self.model = None

    def set_collections(self, collections):
        """
        Set the collections numpy array
        """
        self.collections = np.array(collections)
        np.random.shuffle(self.collections)
        split_idx = int(0.8 * len(self.collections))
        self.collections_training = self.collections[:split_idx]
        self.collections_testing = self.collections[split_idx:]

    def train(self, damping=0.5, max_iter=1000, use_all_data=False):
        """
        Train model for clustering collections
        """
        print("Computing Similarity Matrix")
        if use_all_data:
            dataset = self.collections
        else:
            dataset = self.collections_training

        self.lev_similarity = -1 * np.array([[
            round(0.3 * distance.levenshtein(c1["name"], c2["name"])) +
            math.log10(abs(c1["reddit_score"] - c2["reddit_score"]) + 1) +
            math.log10(abs(c1["twitter_score"] -
                           c2["twitter_score"]) + 1)
            for c1 in dataset] for c2 in dataset])
        print("Creating Model")
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
            round(
                0.3 * distance.levenshtein(
                    self.collections_training[self.model.cluster_centers_indices_[
                        cluster_id]]["name"], word)
            ) +
            math.log10(
                abs(self.collections_training[self.model.cluster_centers_indices_[
                    cluster_id]]["reddit_score"] - reddit_score) + 1
            ) +
            math.log10(
                abs(self.collections_training[self.model.cluster_centers_indices_[
                    cluster_id]]["twitter_score"] - twitter_score) + 1
            ) for cluster_id in np.unique(self.model.labels_)])
        (index, _) = min(enumerate(lev_similarity), key=lambda x: x[1])
        collections = list(dict((v['name'], v) for v in self.collections_training[np.nonzero(
            self.model.labels_ == np.unique(self.model.labels_)[index])]).values())
        return collections[:16]

    def get_mse(self):
        """
        Gets mean squared error of model
        """
        mse = 0
        for collection in self.collections_testing:
            if collection['avg_sale_price'] == 0:
                continue
            print("Getting accuracy of " + collection['name'])
            predictions = self.predict(
                collection['name'], collection['reddit_score'], collection['twitter_score'])
            pred_avg_price = sum([col['avg_sale_price']
                                  for col in predictions]) / len(predictions)
            print("Got prediction avg price of " + str(pred_avg_price))
            print("Actual price of " + str(collection['avg_sale_price']))
            mse += math.pow(pred_avg_price - collection['avg_sale_price'], 2)
            print("-----------------")
        return mse

    def save_model(self):
        """
        Save the model
        """
        with open('collection_model', 'wb') as file:
            pickle.dump(self, file)

    def __str__(self):
        res = ""
        for i, cluster_id in enumerate(np.unique(self.model.labels_)):
            cluster_head = self.collections[self.model.cluster_centers_indices_[
                cluster_id]]
            dict_cluster = np.array(
                self.collections[np.nonzero(self.model.labels_ == cluster_id)])
            cluster = np.unique([col["name"] for col in dict_cluster])
            cluster_str = ", ".join(cluster)
            res += str("cluster %i - *%s:* %s" %
                       (i, cluster_head, cluster_str))
            res += "\n"
        return res

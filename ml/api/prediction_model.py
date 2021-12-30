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
        self.lev_similarity = []
        self.model = None

    def set_collections(self, collections):
        """
        Set the collections numpy array
        """
        self.collections = collections

    def train(self, damping=0.6, max_iter=400):
        """
        Train model for clustering collections
        """
        print("Computing Similarity Matrix")
        self.lev_similarity = -1 * np.array([[
            round(0.3 * distance.levenshtein(c1["name"], c2["name"])) +
            math.log10(abs(c1["reddit_members"] - c2["reddit_members"]) + 1) +
            math.log10(abs(c1["twitter_followers"] -
                       c2["twitter_followers"]) + 1)
            for c1 in self.collections] for c2 in self.collections])
        print("Starting Model")
        self.model = AffinityPropagation(
            affinity="precomputed",
            damping=damping,
            max_iter=max_iter,
            verbose=True)
        self.model.fit(self.lev_similarity)

    def predict(self, word, reddit_members=0, twitter_followers=0):
        """
        Predict using Model
        """
        lev_similarity = np.array([
            round(
                0.3 * distance.levenshtein(
                    self.collections[self.model.cluster_centers_indices_[cluster_id]]["name"], word)
            ) +
            math.log10(
                abs(self.collections[self.model.cluster_centers_indices_[
                    cluster_id]]["reddit_members"] - reddit_members)
            ) +
            math.log10(
                abs(self.collections[self.model.cluster_centers_indices_[
                    cluster_id]]["twitter_followers"] - twitter_followers)
            ) for cluster_id in np.unique(self.model.labels_)])
        (index, _) = min(enumerate(lev_similarity), key=lambda x: x[1])
        return np.unique([col["name"] for col in self.collections[np.nonzero(
            self.model.labels_ == np.unique(self.model.labels_)[index])]])[:6]

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

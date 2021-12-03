"""
Model for clustering collections
"""

import distance
from sklearn.cluster import AffinityPropagation
import numpy as np


class Prediction_Model:  # pylint: disable=invalid-name
    """
    Model for clustering collections
    """

    def __init__(self, collection_names):
        self.collection_names = np.array(collection_names)
        self.lev_similarity = []
        self.model = None

    def train(self, damping=0.6, max_iter=400):
        """
        Train model for clustering collections
        """
        print("Computing Levenshtien Matrix")
        self.lev_similarity = -1 * np.array([[distance.levenshtein(c1, c2)
                                              for c1 in self.collection_names]
                                             for c2 in self.collection_names])
        print("Starting Model")
        self.model = AffinityPropagation(
            affinity="precomputed", damping=damping, max_iter=max_iter, verbose=True)
        self.model.fit(self.lev_similarity)

    def predict(self, word):
        """
        Predict using Model
        """
        lev_similarity = np.array([
            distance.levenshtein(
                self.collection_names[self.model.cluster_centers_indices_[cluster_id]], word)
            for cluster_id in np.unique(self.model.labels_)])
        (index, _) = min(enumerate(lev_similarity), key=lambda x: x[1])
        res = np.unique(self.collection_names[np.nonzero(
            self.model.labels_ == np.unique(self.model.labels_)[index])])
        result = []
        for i, _ in enumerate(res):
            result.append((res[i], distance.levenshtein(res[i], word)))
        result.sort(key=lambda x: x[1])
        return result[:6]

    def __str__(self):
        res = ""
        for i, cluster_id in enumerate(np.unique(self.model.labels_)):
            cluster_head = self.collection_names[self.model.cluster_centers_indices_[
                cluster_id]]
            cluster = np.unique(
                self.collection_names[np.nonzero(self.model.labels_ == cluster_id)])
            cluster_str = ", ".join(cluster)
            res += str(f"cluster {i} - *{cluster_head}:* {cluster_str}")
            res += "\n"
        return res

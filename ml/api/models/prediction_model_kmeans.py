"""
Model for clustering collections
"""

import sys
import distance
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
import prediction_model_abstract


class PredictionModelKMeans(prediction_model_abstract.PredictionModel):
    """
    Model for clustering collections
    """

    def __init__(self, collections, n_clusters=20):
        super().__init__(collections)
        self.kmeans_model = KMeans(n_clusters=n_clusters, max_iter=600)

    def train(self):
        """
        Train model for clustering collections
        """
        self.kmeans_model.fit(self.x_training)

    def predict(self, word, reddit_score=0, twitter_score=0):
        """
        Predict using Model
        """
        row = pd.DataFrame({'reddit_score': pd.Series(
            dtype='float'), 'twitter_score': pd.Series(dtype='float')})
        row = row.append({'reddit_score': reddit_score,
                          'twitter_score': twitter_score}, ignore_index=True)
        scaled_row = self.scaler.transform(row)
        cluster_id = 0
        best_distance = sys.maxsize

        for i, center in enumerate(self.kmeans_model.cluster_centers_):
            dist = prediction_model_abstract.get_distance(scaled_row, center)
            if dist < best_distance:
                best_distance = dist
                cluster_id = i

        indices = np.where(self.kmeans_model.labels_ == cluster_id)[0]
        return sorted(self.data.iloc[indices].to_dict(orient='records'),
                      key=lambda dict: distance.levenshtein(dict['name'], word))[:6]

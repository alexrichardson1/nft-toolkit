"""
Model for clustering collections
"""

import distance
import numpy as np
import pandas as pd
import prediction_model_abstract


class PredictionModelNearestNeighbors(prediction_model_abstract.PredictionModel):
    """
    Model for clustering collections
    """

    def __init__(self, collections, levenshtein_scale=0.5, score_scaler=0.5):
        super().__init__(collections)
        self.levenshtein_scale = levenshtein_scale
        self.score_scaler = score_scaler

    def train(self):
        pass

    def predict(self, word, reddit_score=0, twitter_score=0):
        """
        Predict using Model
        """
        row = pd.DataFrame({'reddit_score': pd.Series(
            dtype='float'), 'twitter_score': pd.Series(dtype='float')})
        row = row.append({'reddit_score': reddit_score,
                          'twitter_score': twitter_score}, ignore_index=True)
        scaled_row = self.scaler.transform(row)
        dataset = pd.DataFrame({'distance': pd.Series(dtype='float')})

        for i in self.x_training.index:
            data_row = self.data.iloc[i]
            distance_to_point = (self.levenshtein_scale *
                                 distance.levenshtein(word, data_row['name'])) + \
                (self.score_scaler * np.sqrt(prediction_model_abstract.get_distance(
                    scaled_row, self.x_training.iloc[i])))
            dataset = dataset.append(
                {'distance': distance_to_point, 'index': i}, ignore_index=True)

        return self.data.iloc[dataset.sort_values('distance').index[:6]].to_dict(orient='records')

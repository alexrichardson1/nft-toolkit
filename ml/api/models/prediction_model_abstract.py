"""
Model for clustering collections
"""

import math
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


class PredictionModel:
    """
    Model for clustering collections
    """

    def __init__(self, collections):
        self.data = pd.DataFrame(
            {'name': pd.Series(dtype='str'),
             'reddit_score': pd.Series(dtype='float'),
             'twitter_score': pd.Series(dtype='float'),
             'avg_sale_price': pd.Series(dtype='float'),
             'volume': pd.Series(dtype='float'),
             'preview_img': pd.Series(dtype='str')})
        for collection in collections:
            if collection['avg_sale_price'] != 0:
                self.data = self.data.append(
                    {'name': collection['name'],
                     'reddit_score': collection['reddit_score'],
                     'twitter_score': collection['twitter_score'],
                     'avg_sale_price': collection['avg_sale_price'],
                     'volume': collection['volume'],
                     'preview_img': collection['preview_img']}, ignore_index=True)

        self.x_training, testing = train_test_split(self.data.drop(
            columns=['name', 'avg_sale_price', 'volume', 'preview_img']), test_size=0.4)
        self.x_validation, self.x_testing = train_test_split(
            testing, test_size=0.5)
        self.scaler = StandardScaler()

    def set_collections(self, collections):
        """
        Set the collections numpy array
        """
        self.data = pd.DataFrame(
            {'name': pd.Series(dtype='str'),
             'reddit_score': pd.Series(dtype='float'),
             'twitter_score': pd.Series(dtype='float'),
             'avg_sale_price': pd.Series(dtype='float'),
             'volume': pd.Series(dtype='float'),
             'preview_img': pd.Series(dtype='str')})

        for collection in collections:
            if collection['avg_sale_price'] != 0:
                self.data = self.data.append(
                    {'name': collection['name'],
                     'reddit_score': collection['reddit_score'],
                     'twitter_score': collection['twitter_score'],
                     'avg_sale_price': collection['avg_sale_price'],
                     'volume': collection['volume'],
                     'preview_img': collection['preview_img']}, ignore_index=True)

        self.x_training, testing = train_test_split(self.data.drop(
            columns=['name', 'avg_sale_price', 'volume', 'preview_img']), test_size=0.4)
        self.x_validation, self.x_testing = train_test_split(
            testing, test_size=0.5)

    def preprocess_data(self):
        """
        Preprocess data passed in
        """
        x_scaled = self.scaler.fit_transform(self.x_training)
        self.x_training = pd.DataFrame(x_scaled)

    def train(self):
        """
        Train model for clustering collections
        """
        raise NotImplementedError("TRAIN NOT IMPLEMENTED")

    def predict(self, word, reddit_score=0, twitter_score=0):
        """
        Predict using Model
        """
        raise NotImplementedError("TRAIN NOT IMPLEMENTED")

    def get_rmse(self):
        """
        Gets mean squared error of model
        """
        mse = 0
        total_validated = 0
        for i in self.x_validation.index:
            row = self.data.iloc[i]
            price = row['avg_sale_price']
            predictions = self.predict(
                row['name'], row['reddit_score'], row['twitter_score'])
            pred_avg_price = sum([col['avg_sale_price']
                                  for col in predictions]) / len(predictions)
            total_validated += 1
            mse += math.pow(pred_avg_price - price, 2)
        return math.sqrt(mse / total_validated)

    def save_model(self):
        """
        Save the model
        """
        with open('/api/collection_model', 'wb') as file:
            pickle.dump(self, file)


def get_distance(df1, df2):
    """
    Calculate Euclideun distance ^2 between to dataframes
    """
    return math.pow(df1[0][0] - df2[0], 2) + math.pow(df1[0][1] - df2[1], 2)

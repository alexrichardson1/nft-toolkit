"""
Model for clustering collections
"""

import math
from select_model import get_distance
import distance
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split


class PredictionModelNearestNeighbors:
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

    def preprocess_data(self):
        """
        Preprocess data passed in
        """
        x_scaled = self.scaler.fit_transform(self.x_training)
        self.x_training = pd.DataFrame(x_scaled)

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
            distance_to_point = distance.levenshtein(
                word, data_row['name']) + np.sqrt(get_distance(scaled_row, self.x_training.iloc[i]))
            dataset = dataset.append(
                {'distance': distance_to_point, 'index': i}, ignore_index=True)

        return self.data.iloc[dataset.sort_values('distance').index[:16]].to_dict(orient='records')

    def get_rmse(self):
        """
        Gets mean squared error of model
        """
        mse = 0
        total_validated = 0
        for i in self.x_validation.index:
            row = self.data.iloc[i]
            name = row['name']
            price = row['avg_sale_price']
            print("Getting accuracy of " + name)
            predictions = self.predict(
                name, row['reddit_score'], row['twitter_score'])

            pred_avg_price = sum([col['avg_sale_price']
                                  for col in predictions]) / len(predictions)
            print("Got prediction avg price of " + str(pred_avg_price))
            print("Actual price of " + str(price))
            total_validated += 1
            mse += math.pow(pred_avg_price - price, 2)
            print("-----------------")
        return math.sqrt(mse / total_validated)


# sys.path.insert(1, "api/")
# from routes import get_collection


# db_collection = get_collection()
# collections = db_collection.find({})

# model = PredictionModelNearestNeighbors(list(collections))

# model.preprocess_data()
# model.train()
# print(f"RMSE is {model.get_rmse()}")

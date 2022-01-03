"""
Script to find best model
"""

import pickle
import math


def save_model(model):
    """
    Save the model
    """
    with open('/api/collection_model', 'wb') as file:
        pickle.dump(model, file)


def get_distance(df1, df2):
    """
    Calculate Euclideun distance ^2 between to dataframes
    """
    return math.pow(df1[0][0] - df2[0], 2) + math.pow(df1[0][1] - df2[1], 2)

"""
Script to find best model
"""

import pickle


def save_model(model):
    """
    Save the model
    """
    with open('/api/collection_model', 'wb') as file:
        pickle.dump(model, file)

"""
Test API - tests flask functionality
"""
import sys
import pickle

sys.path.insert(1, './api')
sys.path.insert(1, './api/models')
from prediction_model_abstract import PredictionModel  # noqa # pylint:disable=import-error, wrong-import-position


def test_model_instance():
    """
    Test pickle object is a PredictionModel
    """
    with open('./api/collection_model', 'rb') as file:
        model = pickle.load(file)
        assert isinstance(model, PredictionModel)


def test_model_predictions():
    """
    Test model to predict with name already on the market
    """
    with open('./api/collection_model', 'rb') as file:
        model = pickle.load(file)
        preds = model.predict("cryptopunks")
        assert "cryptopunks" in [col['name'] for col in preds]


def test_model_predictions_2():
    """
    Test model to predict with name and scores already on the market
    """
    with open('./api/collection_model', 'rb') as file:
        model = pickle.load(file)
        preds = model.predict("cryptopunks", 1000, 1000)
        assert "cryptopunks" in [col['name'] for col in preds]


def test_model_predictions_empty_collection_name():
    """
    Test model to predict with name and scores already on the market
    """
    with open('./api/collection_model', 'rb') as file:
        model = pickle.load(file)
        preds = model.predict("")
        assert len(preds) >= 0

"""
Main for running flask app
"""

# pylint: disable=unused-import
from prediction_model import Prediction_Model
import routes


if __name__ == '__main__':
    app = routes.create_app()
    app.run(port=4000)

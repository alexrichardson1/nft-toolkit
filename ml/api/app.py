"""
Main for running flask app
"""

from .prediction_model import Prediction_Model  # pylint: disable=unused-import
from .routes import create_app


if __name__ == '__main__':
    app = create_app()
    app.run(port=4000)

"""
Price Prediction Flask - run the flask server and check routes

Routes
    - / : hompage
    - /api/price-prediction/{RARITY} : price prediction
"""
from app import create_app

if __name__ == '__main__':
    app = create_app()
    app.run(port=4000)

"""
Test API - tests flask functionality
"""
import os
import tempfile
import json
import pytest
from api import create_app


@pytest.fixture(name="client_app")
def client():
    """
    Client App
    - Creates a flask application

    return:
        app - returns flask test app
    """
    db_fd, db_path = tempfile.mkstemp()
    app = create_app({'TESTING': True, 'DATABASE': db_path})

    # pylint: disable=redefined-outer-name
    with app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(db_path)


class TestRoutes:
    """
    Test the routing for ML API
    """

    # pylint: disable=R0201
    def test_home(self, client_app):
        """
        Testing the flask app has been created
        """

        res = client_app.get('/')
        print("Home Page Status", res.status)
        print("Status 200?", res.status == "200 OK")

    # pylint: disable=R0201
    def test_price_response(self, client_app):
        """
        Testing the price prediction gives a response
        """

        res = client_app.get('/api/price-prediction/30')
        print("Home Page Status", res.status)
        print("Status 200?", res.status == "200 OK")
        print("Response Content Type", res.content_type)
        assert res.status == "200 OK"


class TestPrice:
    """
    Testing price prediction skeleton
    """

    # pylint: disable=R0201
    def test_price_prediction(self, client_app):
        """
        Test that you get a price prediction value for an item within the range
        """
        for i in range(1, 101):
            res = client_app.get('/api/price-prediction/'+str(i))
            assert res.status == "200 OK"
            assert res.content_type == "application/json"
            data = json.loads(res.data)
            print("Response Data", data)
            assert "price" in data

    # pylint: disable=R0201
    def test_failed_price_prediction(self, client_app):
        """
        Test that you get a price prediction value for an item within the range
        """
        res = client_app.get('/api/price-prediction/-1')
        assert res.status == "200 OK"
        assert res.data == b"Failed"

        res = client_app.get('/api/price-prediction/101')
        assert res.status == "200 OK"
        assert res.data == b"Failed"

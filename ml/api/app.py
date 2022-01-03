"""
Main for running flask app
"""

import routes


if __name__ == '__main__':
    app = routes.create_app()
    app.run(host='0.0.0.0', port=4000)

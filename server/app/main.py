import logging
import aiohttp_cors
import argparse
from aiohttp import web
from kiwi_api import init_api, close_session
from views import flight_optimizer
from aiohttp_swagger import *


# Main file where we initialize our applications
# Used asynchronous aiohttp library for web server and requesting Kiwi api
# More about aiohttp https://aiohttp.readthedocs.io/en/stable/
def init_app():
    app = web.Application()

    # Initialize client session when application started
    app.on_startup.append(init_api)

    # Close session on application stoped
    app.on_cleanup.append(close_session)

    # Enable CORS for all origins with all CORS features
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })
    resource = cors.add(app.router.add_resource("/flight-optimizer"))
    cors.add(resource.add_route("GET", flight_optimizer))
    logging.basicConfig(level=logging.DEBUG)
    setup_swagger(app,
                  title="Flight Optimizer API",
                  description="",
                  swagger_url="/docs")
    return app


app = init_app()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', help='Port_number', default='8080')
    args = parser.parse_args()
    web.run_app(app, port=args.port)

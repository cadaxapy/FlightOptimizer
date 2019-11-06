import asyncio
import json
from haversine import haversine
from aiohttp import web


async def flight_optimizer(request):
    try:
        # Getting query parameters from request
        from_city = request.rel_url.query['from']
        to_cities = request.rel_url.query.getall('to')

        kiwi_api = request.app['kiwi_api']

        # Getting location and id of departure city
        # Method accepts name of city and returns dict with values:
        #   name: string,
        #   id: string,
        #   location:tuple(lat, lon)
        from_city_info = await kiwi_api.get_city_info(from_city)

        # Asynchronously receiving ids and locations of arrival cities
        coroutines = []
        for to_city in to_cities:
            coroutines.append(kiwi_api.get_city_info(to_city))
        to_cities_info = await asyncio.gather(*coroutines)

        # Getting cheapest flights from kiwi api
        # Method accepts 2 arguments: (id of departure city, list of arrival city ids)
        # and returns dict where key equals city of id and value equals flight cost in USD
        to_cities_ids = [to_city['id'] for to_city in to_cities_info]
        cheapest_flights = await kiwi_api.get_cheapest_flights(from_city_info['id'], to_cities_ids)

        # calculating cost per km, sorting and getting minimal result
        min_val = None
        for to_city_info in to_cities_info:

            if not to_city_info['id'] in cheapest_flights:
                continue

            cost = cheapest_flights[to_city_info['id']]
            distance = haversine(
                from_city_info['location'], to_city_info['location'])
            cost_per_distance = round(cost / distance, 2)

            if not min_val:
                min_val = {
                    'city': to_city_info['name'],
                    'cost_per_distance': cost_per_distance,
                }
            elif min_val['cost_per_distance'] > cost_per_distance:
                min_val = {
                    'city': to_city_info['name'],
                    'cost_per_distance': cost_per_distance,
                }

        response_dict = {}
        if not min_val:
            response_dict['found'] = False
            return web.json_response(body=json.dumps(response_dict), status=200)
        response_dict['found'] = True
        response_dict['flight'] = {
            'city': min_val['city'],
            'cost': f"{min_val['cost_per_distance']}$/km"
        }
        return web.json_response(body=json.dumps(response_dict), status=200)
    except KeyError as e:
        return web.json_response(text=str('Incorrect parameters'), status=500)
    except Exception as e:
        return web.HTTPInternalServerError(text=str(e), status=500)

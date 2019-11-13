import asyncio
import json
from haversine import haversine
from aiohttp import web
from aiohttp_swagger import *
import operator


@swagger_path("flight_optimizer_doc.yml")
async def flight_optimizer(request):
    try:
        from_city = request.rel_url.query['from']
        to_cities = request.rel_url.query.getall('to')

        # Removing duplicates
        to_cities = list(dict.fromkeys(to_cities))

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

        # calculating cost per km
        results = []
        not_found_results = []
        for to_city_info in to_cities_info:
            if not to_city_info['id'] in cheapest_flights:
                not_found_results.append({
                    'from': from_city_info['name'],
                    'to': to_city_info['name'],
                    'found': False,
                })
                continue
            cost = cheapest_flights[to_city_info['id']]
            distance = haversine(
                from_city_info['location'], to_city_info['location'])
            cost_per_distance = round(cost / distance, 4)
            results.append({
                'from': from_city_info['name'],
                'to': to_city_info['name'],
                'cost': cost_per_distance,
                'found': True,
            })
        
        results.sort(key=operator.itemgetter('cost'))

        if(len(results) > 0):
            results[0]['cheapest'] = True

        results = results + not_found_results
        response_dict = {
            'flights': results
        }
        return web.json_response(body=json.dumps(response_dict), status=200)
    except Exception as e:
        response_dict = {
            'error': str(e),
        }
        return web.json_response(body=json.dumps(response_dict), status=500)

from haversine import haversine, Unit
from datetime import datetime, timedelta
import aiohttp

URL = 'https://api.skypicker.com'


class KiwiApi:
    def __init__(self, url):
        self.url = URL
        self.__session = aiohttp.ClientSession()

    async def close_session(self):
        return await self.__session.close()

    async def get_city_info(self, city_name):
        response = await self.__session.get(f'{self.url}/locations',
                                          params={
                                              'term': city_name,
                                              'location_types': 'city',
                                              'sort': 'rank',
                                              'limit': 1,
                                          })
        data = await response.json()
        if len(data) == 0 or len(data['locations']) == 0:
            raise Exception(f'location {city_name} not found')
        city_info = data['locations'][0]
        return {
            'name': city_info['name'],
            'id': city_info['id'],
            'location': (city_info['location']['lat'], city_info['location']['lon']),
        }

    async def get_cheapest_flights(self, from_city_id, to_cities_id):
        now = datetime.now()
        date_from = now.strftime('%d/%m/%Y')
        date_to = (now + timedelta(hours=24)).strftime('%d/%m/%Y')
        params = [
            ('fly_from', from_city_id),
            ('to', ','.join(to_cities_id)),
            ('one_for_city', 1),
            ('adults', 1),
            # ('date_from', date_from),
            ('date_to', date_to),
            ('partner', 'picky'),
            ('curr', 'USD'),
        ]
        response = await self.__session.get(f'{self.url}/aggregation_flights',
                                          params=params)
        json_data = await response.json()
        print(json_data)
        return json_data['data']


async def init_api(app):
    app['kiwi_api'] = KiwiApi(URL)


async def close_session(app):
    await app['kiwi_api'].close_session()

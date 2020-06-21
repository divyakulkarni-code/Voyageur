import googlemaps
from datetime import datetime

@app.route('/choose_trip/<city>')
def homepage(city):
    """View trip page"""
    location = tuple()
    # TODO:Fetch from DB
    if city == 'SFO':
        location = (37.7749,-122.4194)
    if city == 'NYC':
        location = (40.71427, -74.00597)
    if city == 'Boston': 
        location = (42.35843, -71.05977)
    if city == 'Philadelphia': 
        location = (39.95233, -75.16379)
    if city == 'Miami': 
        location = (25.77427, -80.19366)

    # Send request by API
    print("##################Making API call from Server#####################")
    response = requests.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + urlencode(
            {'location': location, 'rankby': 'prominence','types' : 'tourist_attraction' , 'key': gmaps_key, 'radius': 6000}))
    # Read response as json
    resp_address = response.json()
    if resp_address['status'] == 'OK':
        resp_address = resp_address['results']

        places_dictionary = {}

        for result in resp_address:   
            name = result['name']
            places = result['place_id']
            # lat = resp_address['geometry']['location']['lat']
            # lng = resp_address['geometry']['location']['lng']
            # vicinity_addr = resp_address['vicinity']
            # place_id = resp_address['place_id']
            # glb_rating = resp_address['rating']
            # totnb_reviews = resp_address['user_ratings_total']
            # return [lat, lng, vicinity_addr, place_id, glb_rating, totnb_reviews]

            places_dictionary[places] = name

        print(places_dictionary)

        return jsonify(places_dictionary)
    else:
        print('Failed to get json response:', resp_address)
        return ['place_id is not found', location]  
result_places = nearby_places['results']

print(result_places[0]['name'])






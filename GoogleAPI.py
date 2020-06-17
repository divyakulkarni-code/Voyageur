import googlemaps
from datetime import datetime

gmaps = googlemaps.Client(key = 'AIzaSyAgbtLGPnoZfOiu4a2EdmB7aEfnTLJ_Sd8')

nearby_places = gmaps.places_nearby(location = (37.7749,-122.4194),
                                rank_by = "prominence",
                                type = 'tourist_attraction',
                                radius = 500
                                )

print(type(nearby_places))

result_places = nearby_places['results']

print(result_places[0]['name'])






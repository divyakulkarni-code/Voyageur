from model import db, Traveler, Trip, Sight, Trip_Sight, Place_Detail, connect_to_db

''' Creating Traveler table'''

def create_User(first_name, last_name, user_name, email_id, password):
    traveler = Traveler(first_name = first_name, 
                last_name = last_name,
                user_name = user_name,
                email_id = email_id,
                password = password
                )

    db.session.add(traveler)
    db.session.commit()

    return traveler

def get_user_by_user_name(user_name):
    return Traveler.query.filter(Traveler.user_name == user_name).first()


''' Creating Trip table'''
    
def create_Trip(traveler_id, trip_name, trip_city, travel_date_from, travel_date_to):
    trip = Trip(traveler_id = traveler_id,
                trip_name = trip_name,
                trip_city = trip_city,
                travel_date_from = travel_date_from,
                travel_date_to = travel_date_to
                )

    db.session.add(trip)
    db.session.commit()

    return trip

''' Retireveing trip by trip id'''

def get_trip_id(trip_id):
    return Trip.query.filter(Trip.trip_id == trip_id).first()

''' Retireveing trip by traveler id'''

def get_trip_by_traveler_id(traveler_id):
    trips = Trip.query.filter(Trip.traveler_id == traveler_id).all()
    return trips

def delete_trip(trip_id):
    delete_trip = Trip.query.filter(Trip.trip_id == trip_id).first()

    db.session.delete(delete_trip)
    db.session.commit()

    return delete_trip

''' Creating Sight table'''

def create_Sight(place_id,sight_name):
    sight = Sight(place_id = place_id,
                    sight_name = sight_name,
                    )  

    db.session.add(sight)
    db.session.commit()

    return sight 

'''Retrieving sight by place id --- OPTIONAL / TODO -Delete Later'''
def get_sight_by_place_id(place_id):
    return Sight.query.filter(Sight.place_id == place_id).first()

'''Retrieving all sights by sight_id'''

def get_sight_by_sight_id(sight_id):
    return Sight.query.filter(Sight.sight_id == sight_id).first()

'''Creating Trip_Sight table'''

def create_Trip_Sight(trip_id, sight_id):
    trip_sight = Trip_Sight(trip_id = trip_id,
                            sight_id = sight_id,
                            )

    db.session.add(trip_sight)
    db.session.commit()

    return trip_sight

'''Retriving all trips by trip id '''

def get_all_sights_by_trip_id(trip_id):
    return Trip_Sight.query.filter(Trip_Sight.trip_id == trip_id).all()

def update_trip_sight_visited(trip_id, sight_id, is_visited):
    # get all sights for the given trip
    sights = get_all_sights_by_trip_id(trip_id)
    # for the given  sight_id record update
    for sight in sights:
        if sight.sight_id == sight_id:
            sight_to_update = sight
            
    sight_to_update.is_visited = is_visited
    db.session.add(sight_to_update)
    db.session.commit()

def delete_trip_sight(trip_id, sight_id):
    delete_trip_sight =  Trip_Sight.query.filter(Trip_Sight.trip_id == trip_id, Trip_Sight.sight_id == sight_id).first()

    db.session.delete(delete_trip_sight)
    db.session.commit()

    return delete_trip_sight


def create_Place_Detail(places, lat, lng, vicinity_addr, glb_rating, totnb_reviews):
    place_detail = Place_Detail(place_id = places,
                                lat = lat,
                                lng = lng,
                                vicinity_addr = vicinity_addr,
                                glb_rating = glb_rating,
                                totnb_reviews = totnb_reviews
                                )   
    
    
    db.session.add(place_detail)
    db.session.commit()

    return place_detail 

def get_lat_lng_by_place_id(place_id):
    return Place_Detail.query.filter(Place_Detail.place_id == place_id).first()

if __name__ == '__main__':
    from server import app
    connect_to_db(app)          

               

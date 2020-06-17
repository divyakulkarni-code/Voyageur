from model import db, Traveler, Trip, Sight, Trip_Sight, connect_to_db


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
    
def create_Trip(trip_name, trip_city, travel_date_from, travel_date_to):
    trip = Trip(trip_name = trip_name,
                trip_city = trip_city,
                travel_date_from = travel_date_from,
                travel_date_to = travel_date_to
                )

    db.session.add(trip)
    db.session.commit()

    return trip

def get_trip_id(trip_id):
    return Trip.query.filter(Trip.trip_id == trip_id).first()

def create_Sight(place_id,sight_name):
    sight = Sight(place_id = place_id,
                    sight_name = sight_name,
                    )  

    db.session.add(sight)
    db.session.commit()

    return sight 

def get_sight(sight):
    return Sight.query.filter(Sight.sight_name == sight).first()


def create_Trip_Sight(trip_id, sight_id):
    trip_sight = Trip_Sight(trip_id = trip_id,
                            sight_id = sight_id,
                            )

    db.session.add(trip_sight)
    db.session.commit()

    return trip_sight
 

if __name__ == '__main__':
    from server import app
    connect_to_db(app)          

               

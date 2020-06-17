import googlemaps
import CRUD
from flask import (Flask, render_template, request, flash, session, redirect, jsonify, url_for)
from datetime import datetime
from model import connect_to_db

app = Flask(__name__)
app.secret_key = "dev"

# Accessing my key
gmaps = googlemaps.Client(key = 'AIzaSyAgbtLGPnoZfOiu4a2EdmB7aEfnTLJ_Sd8')


@app.route('/')
def index():
    """View Login"""
    return render_template('login.html')

@app.route('/register', methods = ['GET','POST'])
def register():
    user_name = request.form.get('user_name')
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    password = request.form.get('password')

    # If all these text fields are empty then redirect to register page because user is 
    # coming in for the first time and request is empty at this point  

    if user_name == None and first_name == None and last_name == None:
        return render_template('register.html')        

    user = CRUD.get_user_by_user_name(user_name)
    if user:
        flash("Username already taken or Cannot create an account with that Username. Try again!")
        return redirect('/register')
    else:
        CRUD.create_User(first_name, last_name, user_name, email, password)
        flash('Account created! Please log in') 

        return redirect('/')   

@app.route('/handlelogin', methods = ['GET','POST'])
def handle_login():
    user_name = request.form.get('user_name')
    password = request.form.get('password')
    print(user_name + 'this is the username')

    user = CRUD.get_user_by_user_name(user_name)
    if user:
        return redirect('/tripcitydetails')
    else:
        flash("Username incorrect or doesn't exist")
        return redirect('/')

@app.route('/tripcitydetails')
def trip_city_details():
    return render_template('homepage.html')

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
    

    nearby_places = gmaps.places_nearby(location = location,
                                                    rank_by = "prominence",
                                                    type = 'tourist_attraction',
                                                    radius = 5000
                                                    )
    result_places = nearby_places['results']

    places_dictionary = {}

    for result in result_places:
        name = result['name']
        places = result['place_id']

        places_dictionary[places] = name

    print(places_dictionary)

    return jsonify(places_dictionary)


@app.route('/save_trip_sight', methods = ['GET','POST'])
def save_trip_sights():
    data = request.get_json()
     # TODO:Remove this
    print(data)

    cityValue = data['selectedCityValue']
    travel_date_from = data['fromDate']
    travel_date_to = data['toDate']
    trip_name = data['tripName']
    checkedValuesDict = data['checkedValuesDict']
    
    created_trip = CRUD.create_Trip(trip_name, cityValue, travel_date_from, travel_date_to)  

    for place_id, sight in checkedValuesDict.items():
        get_sight = CRUD.get_sight(sight)
        if get_sight:
            created_sight = CRUD.get_sight(sight)            
        else:
            created_sight= CRUD.create_Sight(place_id, sight)           

        # Inserting sights in Trip Sight Table as soon as Sights are being created 

        created_trip_sight = CRUD.create_Trip_Sight(trip_id = created_trip.trip_id, sight_id = created_sight.sight_id)

        print(created_trip_sight)

    return redirect('/itinerary')

# @app.route('/itinerary')
# def itinerary():
        


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)


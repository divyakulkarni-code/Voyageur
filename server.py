import googlemaps
import CRUD
import requests
from flask import (Flask, render_template, request, flash, session, redirect, jsonify, url_for)
from datetime import datetime
from model import connect_to_db
from urllib.parse import urlencode
# from urllib3 import urlencode

app = Flask(__name__)
app.secret_key = "dev"


gmaps_key = 'AIzaSyAgbtLGPnoZfOiu4a2EdmB7aEfnTLJ_Sd8'

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
    print(user_name + ' this is the username')

    user = CRUD.get_user_by_user_name(user_name)
    if user:
        if password == user.password:
            session['current_user'] = user_name
            flash(f"Logged in as {user_name}")
            return redirect('/itinerary')
        else:
            flash("Wrong Password!")
            return redirect('/')
    else:
        flash("Username incorrect or doesn't exist")
        return redirect('/')

@app.route('/tripcitydetails')
def trip_city_details():
    return render_template('homepage.html')

@app.route('/choose_trip/<city>', methods = ['GET','POST'])
def choose_trip(city):
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

    lat,lng = location

    # Send request by API
    print("##################Making API call from Server#####################")
    url_data = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=prominence&types=tourist_attraction&key={gmaps_key}&radius=6000'.format(lat = lat,lng = lng,gmaps_key = gmaps_key)
    print(url_data)

    response = requests.get(url_data)
    # Read response as json
    resp_address = response.json()
    if resp_address['status'] == 'OK':
        resp_address = resp_address['results']

        places_dictionary = {}        

        for result in resp_address:   
            name = result['name']
            places = result['place_id']
            lat = result['geometry']['location']['lat']
            lng = result['geometry']['location']['lng']
            vicinity_addr = result['vicinity']
            glb_rating = result['rating']
            totnb_reviews = result['user_ratings_total']

            place = CRUD.get_lat_lng_by_place_id(places)
            if place:
                print("Place id already taken !")
            else:
                CRUD.create_Place_Detail(places, lat, lng, vicinity_addr, glb_rating, totnb_reviews)
           
            places_dictionary[places] = name

        print(places_dictionary)

        return jsonify(places_dictionary)
    else:
        print('Failed to get json response:', resp_address)
        return ('place_id is not found', location)       


@app.route('/save_trip_sight', methods = ['GET','POST']) # change this method
def save_trip_sights():
    data = request.get_json()
     # TODO:Remove this
    print(data)

    cityValue = data['selectedCityValue'] #change variable name city_Value
    travel_date_from = data['fromDate']
    travel_date_to = data['toDate']
    trip_name = data['tripName']
    checkedValuesDict = data['checkedValuesDict']
    traveler_id = CRUD.get_user_by_user_name(session['current_user']).traveler_id

    created_trip = CRUD.create_Trip(traveler_id, trip_name, cityValue, travel_date_from, travel_date_to)  

    for place_id, sight in checkedValuesDict.items(): 
        get_sight = CRUD.get_sight_by_place_id(place_id) #

        if get_sight:  
            created_sight = get_sight 
            print("***** found existing sight get_sight **** :",created_sight)       
        else:
            created_sight= CRUD.create_Sight(place_id, sight)
            print("***** creating new sight **** :",created_sight)

        # Inserting sights in Trip Sight Table as soon as Sights are being created 
        created_trip_sight = CRUD.create_Trip_Sight(trip_id = created_trip.trip_id, sight_id = created_sight.sight_id)

        print(created_trip_sight)

    return redirect('/itinerary')

@app.route('/itinerary')
def itinerary():
    return render_template("itinerary.html") 

@app.route('/fetch_itinerary')
def fetch_itinerary():
    '''Get Traveler Id''' # change this later
    trip_sight = {}
    traveler = CRUD.get_user_by_user_name(session['current_user'])
   
    trips = CRUD.get_trip_by_traveler_id(traveler.traveler_id)

    for trip in trips:
        sight_detail_lst = []
        sights_in_a_trip = CRUD.get_all_sights_by_trip_id(trip.trip_id)
        for sight_in_a_trip in sights_in_a_trip:
            sight = CRUD.get_sight_by_sight_id(sight_in_a_trip.sight_id)
            
            # Fetch lat, lng of a sight
            place_detail = CRUD.get_lat_lng_by_place_id(sight.place_id)
            
            # Merging sight and place_details dict into result
            result_sight = {**sight.to_dict(), **place_detail.to_dict()}
            
            sight_detail_lst.append(result_sight)

        trip_sight[trip.trip_id] = (trip.to_dict(),sight_detail_lst)

    return jsonify(trip_sight) 

@app.route('/delete_item/<trip_id>/<sight_id>' ,methods = ['POST'])
def delete_itinerary_items(trip_id, sight_id):
    trip_sight = CRUD.delete_trip_sight(trip_id, sight_id)
    print(trip_sight)
    
    all_sights = CRUD.get_all_sights_by_trip_id(trip_id)
    print(all_sights)
    if not all_sights:
        trip = CRUD.delete_trip(trip_id)
        print("Deleted", trip)

    return "Removed Successfully!"

@app.route('/delete_trip/<trip_id>', methods = ['POST'])
def delete_trip(trip_id):
    trip = CRUD.delete_trip(trip_id)
    print(trip)

    trip_sights = CRUD.get_all_sights_by_trip_id(trip_id) 
    for trip_sight in trip_sights:
        deleted_trip_sights = CRUD.delete_trip_sight(trip_sight.trip_id, trip_sight.sight_id)
        print(deleted_trip_sights)

    return "Deleted Trip Successfully!"
    

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)


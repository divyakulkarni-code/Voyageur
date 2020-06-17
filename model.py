from flask_sqlalchemy import SQLAlchemy 

db = SQLAlchemy()

class Traveler(db.Model):
    ''' A user.'''

    __tablename__ = 'traveler'

    traveler_id = db.Column(db.Integer, 
                        autoincrement=True, 
                        primary_key = True
                        )
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    user_name = db.Column(db.String, 
                        nullable = False
                        )
    email_id = db.Column(db.String, 
                        nullable = False
                        )
    password = db.Column(db.String, 
                        nullable = False
                        )
    def __repr__(self):
        return f'<User user_name={self.user_name} email_id={self.email_id}>'

class Trip(db.Model):
    ''' A Trip.'''

    __tablename__ = 'trip'

    trip_id = db.Column(db.Integer, 
                        autoincrement = True,
                        primary_key = True,
                        )
    traveler_id = db.Column(db.Integer, 
                        db.ForeignKey('traveler.traveler_id')
                        ) 
    trip_name = db.Column(db.String,
                        nullable = False,
                        )
    trip_city = db.Column(db.String, 
                        nullable = False,
                        )
    travel_date_to = db.Column(db.DateTime,
                            nullable = False)
    travel_date_from = db.Column(db.DateTime,
                            nullable = False,
                            )

    trips = db.relationship('Traveler', backref = 'trip')

    def __repr__(self):
        return f'<Trip trip_id = { self.trip_id } trip_name={self.trip_name} trip_city={self.trip_city}>'

class Sight(db.Model):
    '''A sight.'''

    __tablename__ = 'sight'

    sight_id = db.Column(db.Integer, 
                        autoincrement = True,
                        primary_key = True,
                        )
    place_id = db.Column(db.String,
                        nullable = False,
                        )
    sight_name = db.Column(db.String,
                        nullable = False,
                        )

    def __repr__(self):
        return f'<Sight sight_id ={self.sight_id} sight_name={self.sight_name}>'

class Trip_Sight(db.Model):
    '''A Trip with sights'''

    __tablename__ = 'trip_sight'

    trip_sight_id = db.Column(db.Integer, 
                    autoincrement = True,
                    primary_key = True,
                    )
    trip_id = db.Column(db.Integer, 
                        db.ForeignKey('trip.trip_id')
                        )
    sight_id = db.Column(db.Integer, 
                        db.ForeignKey('sight.sight_id')
                        )

    trips = db.relationship('Trip', backref = 'trip_sight')
    sights = db.relationship('Sight', backref = 'trip_sight' )


def connect_to_db(flask_app, db_uri='postgresql:///travel', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)


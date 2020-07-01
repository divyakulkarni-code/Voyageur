class Itinerary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          itinerary: {},
           city: {
            'SFO' :{lat:37.7749,lng:-122.4194},
            'NYC':{lat:40.71427,lng: -74.00597},
            'Boston':{lat:42.35843,lng: -71.05977},
            'Philadelphia':{lat:39.95233, lng:-75.16379},
            'Miami':{lat:25.77427, lng:-80.19366}
          }
      };
      
    }

  componentDidMount() {
    
    $.get('/fetch_itinerary', (res) => {
      console.log("/fetch_itinerary response from server received.");
      this.setState({ 
        itinerary: res
       });
       this.handleMap();
    });
  }

  componentDidUpdate(prevProps) {
      this.handleMap();
  }

  handleMap() {
    
       // add Google Map script
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgbtLGPnoZfOiu4a2EdmB7aEfnTLJ_Sd8&libraries=places`;
    window.document.body.appendChild(googleMapScript);


    googleMapScript.addEventListener("load", () => { 
      for (const key of Object.keys(this.state.itinerary)) {
        this.createMap(key, this.state.itinerary[key][0].trip_city, this.state.itinerary);
      }
      
    }); 
    }
    
  
    // 1. remove sight from the this.state.itinerary
    //  Look for a given trip_id in the this.state.itinerary ==> get the sights ==> match the sight_id ==> make new list without sight_id ==> upate it back in state.
    // 2. send delete request to server

  removeSightItem(trip_id, traveler_id, sight_id, sight_name) {
    console.log(trip_id, traveler_id, sight_id, sight_name);
    let isSightItemsEmpty = false;
    const itineraryDetail = this.state.itinerary;
    for (const trip of Object.values(itineraryDetail)) {
      if (trip[0].trip_id === trip_id) {
        console.log(trip_id);
        const newSightItems = [];
        const sightItems = trip[1]; 
        for (const sight of sightItems) {
          console.log(sight);
          if (sight.sight_id !== sight_id) {
            newSightItems.push(sight);
          }
        } 
        trip[1] = newSightItems; 
        if (trip[1].length == 0) {
          isSightItemsEmpty = true;
          console.log(isSightItemsEmpty);
        }             
      }      
    }
    console.log(isSightItemsEmpty);
    if (isSightItemsEmpty) {
      const newTrip = [];
      delete itineraryDetail[trip_id];
    }

    console.log(itineraryDetail);

    this.setState({itinerary : itineraryDetail});

    $.post('/delete_item/'+ trip_id +'/'+ sight_id, (res) => {
     console.log("Done");
    });
  }

  removeTrip(trip_id) {
    const itineraryDetail = this.state.itinerary;
    delete itineraryDetail[trip_id];
    console.log(itineraryDetail);
    this.setState({itinerary : itineraryDetail});
    $.post('/delete_trip/'+ trip_id, (res) => {
      console.log("Done");
     });
  }

  addMarkerToMap(sight, trip_id, map) {
    console.log("adding marker for sight ", sight.sight_id, trip_id);
    console.log(parseFloat(sight.lat),parseFloat(sight.lng))
    const location =  new window.google.maps.LatLng(parseFloat(sight.lat),parseFloat(sight.lng));
    new window.google.maps.Marker({
      position: location,
      map: map,
    }); 
  }

  createMap(key, trip_city, res) {
    
    console.log("creating map for ",key, trip_city)
    
    var pos = this.state.city[trip_city];
    const mapOptions = {
      zoom: 12,
      center: pos,
    }

    const map = new window.google.maps.Map(document.getElementById('item-'+key), mapOptions);

    for (const sight of res[key][1]) {
      this.addMarkerToMap(sight, key, map)
    }
    return map;
   
  }

  renderItems() {
    console.log("this.state.itinerary", this.state.itinerary);
    
    return Object.entries(this.state.itinerary).map(([trip_id, trip]) => {
      return <div className = "container-itinerary" key={trip_id.toString()}>
        <table>
        <thead></thead>
        <tbody>
            <tr>
              <td className="trip-info">
                <div>Trip Name : {trip[0].trip_name}</div>
                <div>{trip[0].trip_city}</div>
                <div>{trip[0].travel_date_from}</div>
                <div>{trip[0].travel_date_to}</div>
                <div>
                  <a href="javascript:void(0);" onClick={this.removeTrip.bind(this, trip[0].trip_id)}>
                    Delete Trip
                    </a>
                </div>
              </td>
            </tr>
            <tr>
            <td>
              <div
                id={`item-${trip_id}`}
                ref={this.googleMapRef}
                style={{ width: '600px', height: '300px' }}
              >
              </div>
              </td>
            </tr>
            <tr>
            <td>
              <div className="sight_name">
                <div>{trip[1].map(sight => (
                  <div>
                    <table>
                      <thead></thead>
                      <tbody>
                        <tr>
                          <td>
                            {sight.sight_name}
                          </td>
                          <td>
                            <a className="remove-sight-item" href="javascript:void(0);" onClick={this.removeSightItem.bind(this, trip[0].trip_id, trip[0].traveler_id, sight.sight_id, sight.sight_name)}>
                              Remove Sight
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
                </div>
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    });
  }

  handleFlashMessage() {
    var name = React.findDOMNode(this.refs.flashDev).value;
    return (<div>
      Logged in as {name}
    </div>);
  }

  render(){
    return (
      <div className='trip_sight'>
        <div className="navclass"><Navbar/></div>
        <div>
          {/* {this.handleFlashMessage()} */}
        </div>
        <section className="content-container-itinerary">
          <section className="row justify-content-center">
            {this.renderItems()}
          </section>
        </section>
        <section className="content-button">
          <section className="row justify-content-center">
            <div className='itinerary-button'>

              <a href="/tripcitydetails" className="btn btn-primary">Create Trip</a>
            </div></section>
        </section>
      </div>
    );
  }
}

ReactDOM.render(
    <Itinerary />,
    document.getElementById("app")
);




  
  
   
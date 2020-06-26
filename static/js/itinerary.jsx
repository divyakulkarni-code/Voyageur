class Itinerary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {itinerary: {}
                    };
    }

  componentDidMount() {
      $.get('/fetch_itinerary', (res) => {
        this.setState({ itinerary: res });
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

    $.post('/deleteItems/'+ trip_id +'/'+ sight_id, (res) => {
     console.log("Done");
    });
  }

  removeTrip(trip_id) {
    const itineraryDetail = this.state.itinerary;
    delete itineraryDetail[trip_id];

    console.log(itineraryDetail);
    this.setState({itinerary : itineraryDetail});
    $.post('/deleteTrip/'+ trip_id, (res) => {
      console.log("Done");
     });
  }

  renderItems() {
    console.log("this.state.itinerary",this.state.itinerary);
    return Object.entries(this.state.itinerary).map(([key,trip]) =>
      {
        return <div key={key.toString()}>
          <div className="trip_name">
            <div>{trip[0].trip_name}</div>
            <div>{trip[0].trip_city}</div>
            <div>{trip[0].travel_date_from}</div>
            <div>{trip[0].travel_date_to}</div>
            <div>
            <a href="javascript:void(0);" onClick={this.removeTrip.bind(this, trip[0].trip_id)}>
                      Delete Trip
                    </a>
            </div>
          </div>
          
          <div className="sight_name">
            <div>{trip[1].map(sight => (
              <div>
                <li key={sight.sight_id.toString()}>
                  {sight.sight_name}
                </li>
                  <div>
                    <a href="javascript:void(0);" onClick={this.removeSightItem.bind(this, trip[0].trip_id, trip[0].traveler_id, sight.sight_id, sight.sight_name)}>
                      Remove Sight
                    </a>
                  </div>
              </div>
            ))}
            </div>
          </div>
        </div>;
      }
       
          );
        }

  render(){
    return (
      <div className='trip_sight'>
        <div>
          {this.renderItems()}
        </div>
        <div>
          <a href="/tripcitydetails" className="btn btn-primary">Create Trip</a>
        </div>

      </div>
    );
  }
}

ReactDOM.render(
    <Itinerary />,
    document.getElementById("app")
);




  
  
   
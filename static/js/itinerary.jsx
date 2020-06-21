class Itinerary extends React.Component {
    constructor(props) {
        super(props);
    }

  componentDidMount() {
      $.get('/fetch_itinerary', (res) => {
        this.setState({ itinerary: res });
      });
    }

  render () {
    return(
      <div>
        <div>
            <h1>{trip_name}</h1>
        </div>
        <div>
          <ul>
            <li>
              
              
            </li>

          </ul>
        </div>

      </div>
    );
  }

}

ReactDom.render(
    <Itinerary />,
    document.getElementById("app")
);




  
  
   
class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }
}

componentDidMount() {
    $.get('/itinerary', (res) => {
      this.setState({ itinerary: res });
    });
  }

ReactDom.render(
    document.getElementById("app")
);




  
  
   
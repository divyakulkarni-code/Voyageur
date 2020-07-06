class Navbar extends React.Component {  
  constructor(){
    super();

    this.state = {userName : ''};
  }

  componentDidMount() {
    
    $.get('/get_logged_user', (res) => {
      console.log("/get_logged_user response from server received.");
      this.setState({ 
        userName: res
       });
    });
  }
    
    render () {
        return (

          <div className="container container-navbar">
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top justify-content-between">

              <a className="navbar-brand" href="#">Voyageur</a>
              {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button> */}
              {/* <div className="collapse navbar-collapse" id="navbarNavDropdown"> */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/tripcitydetails">Create Trip <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/itinerary">Upcoming Trips</a>
                </li>
                
              </ul>
              <ul className="navbar-nav logout_ul">
              <li className="nav-item logout" >
                 <label htmlFor = 'userName' className="nav-link">Logged in as, {this.state.userName}</label>
                </li>
              <li className="nav-item logout" >
                  <a className="nav-link" href="/login">Log Out</a>
                </li></ul>
              {/* </div> */}

            </nav>
          </div>     

        );
    }
}

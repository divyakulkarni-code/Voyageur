class Homepage extends React.Component {
    constructor(props) {
        super(props);

        this.dropdownChange = this.dropdownChange.bind(this);
        this.checkedValues = this.checkedValues.bind(this);
        this.fromDateHandler = this.fromDateHandler.bind(this);
        this.toDateHandler = this.toDateHandler.bind(this);
        this.tripNameHandler = this.tripNameHandler.bind(this);
        this.state = { selectedCityValue : '',
                        fromDate: '',
                        toDate:'',
                        tripName : ''
                    };

    }

    dropdownChange(selectedCity) {
        alert('From homepage selected city is '+ selectedCity);
        this.setState({selectedCityValue : selectedCity});
    }

    tripNameHandler(e) {
        
        this.setState({ tripName : e.target.value })
    }

    fromDateHandler(e) {
        
        this.setState({ fromDate : e.target.value });
    }

    toDateHandler(e) {
        
        this.setState({toDate:e.target.value});
    }

    checkedValues(checkedValuesDict){
        // Passes and notifies serever current selected checkbox values in key: value pair

        console.log("Sending checkbox values to the route");

        const date = new Date().toLocaleString(('en-US', { timeZone: 'America/New_York' }));
        const to_date = new Date(date.toString()).toISOString().split('T')[0];

        if (this.state.selectedCityValue == "selected_city" || this.state.selectedCityValue == '') {
            alert("Please select a city!");
        } else if (this.state.fromDate == '' || this.state.fromDate < to_date || this.state.toDate == '' || this.state.toDate < to_date) {
            alert(" You’re choosing a date in the past!");
        } else if (this.state.tripName == '') {
            alert("Gotcha! can't create trip without a trip name.");
        }
        else {
            console.log("making call...............");
            fetch('/save_trip_sight', {
                method: "POST",
                redirect: "follow",

                // Adding contents to send to the server
                body: JSON.stringify({
                    selectedCityValue: this.state.selectedCityValue,
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    tripName: this.state.tripName,
                    checkedValuesDict: checkedValuesDict

                }),

                // Adding headers to the request 
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(res => {
                    console.log(res);
                    if (res.redirected) {
                        window.location.href = res.url;
                    }
                })
                .then((data) => {
                    console.log(data)
                });

            console.log(this.state.selectedCityValue, this.state.fromDate, this.state.toDate, this.state.tripName, checkedValuesDict);
        }


    }


    render(){        
        return (
            <div className="container-fluid">

                <Navbar />
                <div className="space-conatiner"></div>
                <div className="jumbotron">
                    <h2 className="display-4"> Create Trip</h2>
                    <hr className="my-4"></hr>
                    <div className="input-elements">
                        <div className="input-group">
                            <label> Trip Name </label>
                            <input type="text" id="tripName" name="tripName" placeholder="Trip Name" onChange={this.tripNameHandler} />
                        </div>
                        <div className="input-group">
                            <label> From </label>
                            <input type="date" id="fromDate" name="fromDate" placeholder="Date From" onChange={this.fromDateHandler} />
                        </div>
                        <div className="input-group">
                            <label> To </label>
                            <input type="date" id="toDate" name="toDate" placeholder="Date To" onChange={this.toDateHandler} />
                        </div>
                    </div>
                    <hr className="my-4"></hr>

                    <div className="pick-cities">
                        <FavoriteCity handleDropdownChange={this.dropdownChange} />

                    </div>
                </div>
                <div className="sights">
                    <Sight
                        selectedCityValue={this.state.selectedCityValue}
                        selectedCheckedValues={this.checkedValues}
                    />

                </div>
            </div>

        );

    }


}

ReactDOM.render (
    <Homepage />,
    document.getElementById("app")
);

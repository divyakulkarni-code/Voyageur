class FavoriteCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value : ''};
    
        this.handleChange = this.handleChange.bind(this);

        // this.handleDropdownChange = props;
    }

    handleChange(event) {
        this.setState({value:event.target.value});
        this.props.handleDropdownChange(event.target.value);
      }
    
    
    render () {
        return (
        <form onSubmit = {this.handleSubmit} >
        
            <label>
            Select City:
            <select value = {this.state.value} onChange = {this.handleChange} >
                <option value = "selected_city">Select City</option>
                <option value = "SFO">San Francisco</option>
                <option value = "Miami">Miami</option>
                <option value = "Boston">Boston</option>
                <option value = "NYC">New York</option>
                <option value = "Philadelphia">Philadelphia</option>
            </select>
            </label>
    
        </form>
        );
    }
}


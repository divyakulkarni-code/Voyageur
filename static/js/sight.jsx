class Sight extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            sights: {},            
            isShiftDown : false,
            selectedItems:[],
            lastSelectedItem : null
        };

        //this.listE1 = null;

        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSelectItem = this.handleSelectItem.bind(this);
        this.handleSelectStart = this.handleSelectStart.bind(this); 
        this.checkStatus = this.checkStatus.bind(this);     

    }

    handlePopertyChange() {
            if (this.props.selectedCityValue != "") {
            console.log('Making API Call');
            fetch('/choose_trip/'+this.props.selectedCityValue)
            .then(res => res.json())
            .then((data) => {
              this.setState({ sights: data })
            })
            .catch(console.log);
    
        }
    }

    componentDidMount() {
        console.log(this.props.selectedCityValue);
        this.handlePopertyChange();
        document.addEventListener("keyup", this.handleKeyUp, false);
        document.addEventListener("keydown", this.handleKeyDown, false);
       // this.listE1.addEventListener("selectStart", this.handleSelectStart, false);

    }
    componentDidUpdate(prevProps) {
        console.log(this.props.selectedCityValue);
        if (prevProps.selectedCityValue != this.props.selectedCityValue) {
            console.log('componentDidUpdate');
            this.handlePopertyChange();
        }
        
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener("keydown", this.handleKeyDown);
       // this.listE1.removeEventListener("selectStart", this.handleSelectStart);
    }

    handleSelectStart(e) {
        if (this.state.isShiftDown) {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        if(e.key === "Shift" && this.state.isShiftDown) {
            this.setState({isShiftDown:false});
        }
    }

    handleKeyDown(e) {
        if(e.key === "Shift" && !this.state.isShiftDown) {
            this.setState({isShiftDown: true});
        }
    }

    handleSelectItem(e) {
        const{ value } = e.target;
        const nextValue = this.getNextValue(value);

        this.setState({selectedItems: nextValue, lastSelectedItem: value});
    }

    getNextValue(value) {
        const{ isShiftDown, selectedItems} = this.state;
        const hasBeenSelected = !selectedItems.includes(value);

        if (isShiftDown) {
            const newSelectedItems = this.getNewSelectedItems(value);
            // de-dupe an array using a set

            const selections = [...new Set([...selectedItems, ...newSelectedItems])];

            if (!hasBeenSelected) {
                return selections.filter(item => !newSelectedItems.includes(items));
            }

            return selections;
        }

        return selectedItems.includes(value)
            ? selectedItems.filter(item => item !== value)
            : [...selectedItems, value];
        }

    getNewSelectedItems(value) {
            const { lastSelectedItem, sights } = this.state;
            const currentSelectedIndex = Object.keys(sights).find( function(item) { return item.key == value });
            const lastSelectedIndex =  Object.keys(sights).find( function(item) { return item.key == lastSelectedItem });

        return Object.keys(sights)
        .slice(
            Math.min(lastSelectedIndex, currentSelectedIndex),
            Math.max(lastSelectedIndex, currentSelectedIndex) + 1
        )
        .map(item => item.key);
    }

    renderItems() {
        const { sights, selectedItems } = this.state;
        return  Object.entries( this.state.sights).map(([key, value]) =>
                    <li key = { key.toString() }>
                    <input onChange = { this.handleSelectItem }
                    type = "checkbox"
                    checked = { selectedItems.includes(key)}
                    value = { key.toString() }
                    id = { `item-${key}`}/>
                    <label htmlFor = {`item-${key}`}> {value}</label>

                </li>
            
        );
    }

    checkStatus() {
        const checkedValues = {}
        // Key = Place_id Value = Sight-Name
        for (const item of this.state.selectedItems) {
            checkedValues[item]= this.state.sights[item];                        
        } 
        
        this.props.selectedCheckedValues(checkedValues);      
    }
      

    render() {

        const cityValue = this.props.selectedCityValue;
        // const sightItems = Object.entries( this.state.sights).map(([key, value]) =>
        //     // Correct! Key should be specified inside the array.
        //     <li key={key.toString()}  >
        //         {value}
        //     </li>
        // );

        return (<div>
                        {cityValue}
                        <div>
                        <ul style = {{listStyleType: "none"}}>
                            {this.renderItems()}
                        </ul>
                        </div>
                        <div>
                            <button className = "btn" onClick = {this.checkStatus}> Let's Travel </button>
                        </div>
                </div>
            );

    }
}
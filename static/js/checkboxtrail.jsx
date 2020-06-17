class SelectedSights extends React.Component {
    constructor() {
        super();

        this.state = {
            // items: <list of tourist attractions>,
            isShiftDown : false,
            selectedItems:[],
            lastSelectedItem : null
        };

        this.listE1 = null;

        this.handleKeyUp = this.handleKeyUp.din(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSelectItem = this.handleSelectItem.bind(this);
        this.handleSelectStart = this.handleSelectStart.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keyup", this.handleKeyUp, false);
        document.addEventListener("keydown", this.handleKeyDown, false);
        this.listE1.addEventListener("selectStart", this.handleSelectStart, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener("keydown", this.handleKeyDown);
        this.listE1.removeEventListener("selectStart", this.handleSelectStart);
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

    handleSelecItem(e) {
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
                return selections.filter(item => !newSelectedItems.includes(item));
            }

            return selections;
        }

        return selectedItems.includes(value)
            ? selectedItems.filter(item => item !== value)
            : [...selectedItems, value];
        }

    getNewSelectedItems(value) {
            const { lastSelectedItem, sights } = this.state;
            const currentSelectedIndex = sights.findIndex(item => item.id === value);
            const lastSelectedIndex = sights.findIndex(
                item => item.id === lastSelectedItem
            );

        return sights
        .slice(
            Math.min(lastSelectedIndex, currentSelectedIndex),
            Math.max(lastSelectedIndex, currentSelectedIndex) + 1
        )
        .map(item => item.id);
    }



    // renderItems

    renderItems() {
        const { sights, selectedItems } = this.state;
        return sights.map(item => {
            const { id, label } = item;
            return (
                <li key = { id }>
                    <input onChange = { this.handleSelecItem }
                    type = "checkbox"
                    checked = { selectedItems.includes(id)}
                    value = { id }
                    id = { `item-${id}`}/>
                    <label htmlFor = {`item-${id}`}>{label}</label>

                </li>
            );
        });
    }

    // renderMethods

    render() {
        return <ul ref={node => (this.listEl = node)}>{this.renderItems()}</ul>;
    }


}



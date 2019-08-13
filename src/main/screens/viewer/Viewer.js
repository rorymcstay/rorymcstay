import React, {Component} from "react";
import DataViewer from "./DataViewer";
import QueryConstructor from "./QueryConstructor";


class Viewer extends Component {

    constructor() {
        super();
        this.state = {
            searchField: "",
            searchString: "",
            triggerSearch: false
        }

    }

    onClick = () => {
        this.setState(
            {triggerSearch: true}
        )
    };

    onSearchStringChange = name => {
        this.setState({searchString: name.target.value})
    };

    onSearchFieldChange = name => {
        this.setState({searchField: name.target.value})
    };

    render() {
        if (this.state.triggerSearch) {
            return (
                <div>
                    <QueryConstructor
                        onSearchStringChange={this.onSearchStringChange}
                        onSearchFieldChange={this.onSearchFieldChange}
                        onClick={this.onClick}
                    />
                    <DataViewer
                        searchField={this.state.searchField}
                        searchString={this.state.searchString}
                        feedName={this.props.feedName}
                    />
                </div>
            )
        }
        else {
            return (
                <div>
                    <QueryConstructor
                        onSearchStringChange={this.onSearchStringChange}
                        onSearchFieldChange={this.onSearchFieldChange}
                        onClick={this.onClick}
                    />
                </div>
            )
        }


    }
}

export default Viewer
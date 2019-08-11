import React, {Component} from "react";
import DataViewer from "./DataViewer";
import QueryConstructor from "./QueryConstructor";


class Viewer extends Component {

    constructor() {
        super();
        this.state = {
            searchField: "",
            searchString: ""
        }

    }

    onSearchStringChange = name => {
        this.setState({searchString: name.target.value})
    };

    onSearchFieldChange = name => {
        this.setState({searchField: name.target.value})
    };


    render() {
        return (
            <div>
                <QueryConstructor
                    onSearchStringChange={this.onSearchStringChange}
                    onSearchFieldChange={this.onSearchFieldChange}
                />
                <DataViewer
                    searchField={this.state.searchField}
                    searchString={this.state.searchString}
                    feedName={this.props.feedName}
                />
            </div>)

    }
}
export default Viewer
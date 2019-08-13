import React, {Component} from "react";
import Button from "react-bootstrap/Button";


class QueryConstructor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchField: props.searchField,
            searchString: props.searchString
        }
    }

    render() {
        return (
            <div>
                <form>
                    <input name="searchField"
                           placeholder="Field to Search"
                           value={this.state.searchField}
                           onChange={searchField => this.props.onSearchFieldChange(searchField)}/>
                    <input name="searchString"
                           placeholder="Search String"
                           value={this.state.searchString}
                           onChange={searchString => this.props.onSearchStringChange(searchString)}/>
                </form>
                <Button onClick={this.props.onClick}>
                    Search
                </Button>
            </div>
        )
    }
}

export default QueryConstructor
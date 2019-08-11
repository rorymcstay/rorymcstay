import React, {Component} from "react";


class QueryConstructor extends Component {



    render() {
        return (
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
        )
    }

}

export default QueryConstructor
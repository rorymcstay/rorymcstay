import React, { Component } from 'react';
import ParameterManager from "./parameters/ParameterManager";
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import Toolbar from "./Toolbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DataViewer from "./DataViewer";

class Manager extends Component {


    constructor() {
        super();
        this.state = {
            feeds: [],
            feedName: "donedeal",
            searchField: "",
            searchString: ""
        }

    }

    onFeedChange = name => {
        this.setState({feedName: name.target.value})
    };

    onSearchStringChange = name => {
        this.setState({searchString: name.target.value})
    };

    onSearchFieldChange = name => {
        this.setState({searchField: name.target.value})
    };


    render() {
        const { fetchFeeds } = this.props;
        if (fetchFeeds.pending) {
            return <ReactLoading height={667} width={375} />
        } else if (fetchFeeds.rejected) {
            return <div>Error</div>
        } else if (fetchFeeds.fulfilled) {
            return (
                <div>
                    <form>
                        <input name="feedName"
                            placeholder="Feed Name"
                            value={this.state.feedName}
                            onChange={fields => this.onFeedChange(fields)}/>
                    </form>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={this.state.key}
                        onSelect={key => this.setState({ key })}
                    >
                        <Tab eventKey="toolbar" title="Toolbar">
                            <Toolbar onChange={name => this.onFeedChange(name)} feeds={this.props.fetchFeeds.value}/>
                        </Tab>
                        <Tab eventKey="parametermanager" title="Parameter Manager">
                            <ParameterManager feedName={this.state.feedName}/>
                        </Tab>
                        <Tab eventKey="dataViewer" title="Data Viewer">
                            <form>
                                <input name="searchField"
                                    placeholder="Field to Search"
                                    value={this.state.searchField}
                                    onChange={searchField => this.onSearchFieldChange(searchField)}/>
                                <input name="searchString"
                                    placeholder="Search String"
                                    value={this.state.searchString}
                                    onChange={searchString => this.onSearchStringChange(searchString)}/>
                            </form>
                            <DataViewer
                                searchField={this.state.searchField}
                                searchString={this.state.searchString}
                                feedName={this.state.feedName}
                            />
                        </Tab>
                    </Tabs>
                    </div>
        )
        }

    }
}

export default connect(props => ({
    fetchFeeds: `/feedmanager/getFeeds`
}))(Manager)
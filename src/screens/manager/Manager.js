import React, { Component } from 'react';
import ParameterManager from "./parameters/ParameterManager";
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import Toolbar from "./Toolbar";

class Manager extends Component {


    constructor() {
        super();
        this.state = {
            feeds: [],
            feedName: "donedeal",
        }

    }

    onFeedChange = name => {
        this.setState({feedName: name})
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
                <Toolbar onChange={name => this.onFeedChange(name)} feeds={this.props.fetchFeeds.value}/>
                <ParameterManager feedName={this.state.feedName}/>
            </div>
        )
        }

    }
}

export default connect(props => ({
    fetchFeeds: `/feedmanager/getFeeds`
}))(Manager)
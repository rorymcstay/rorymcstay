import React, {Component} from 'react';
import {connect} from "react-refetch";
import {Grid} from "semantic-ui-react";
import Button from "react-bootstrap/Button";
import {ButtonGroup, ButtonToolbar} from "react-bootstrap";

class ToolBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedName: props.feedName
        }
    }

    onFeedStart = () => {
        this.setState({started: true}, this.props.startFeed())
    };
    onSampleFeed= () => {
        this.setState({started: true}, this.props.sampleFeed())
    };
    onSingleFeed= () => {
        this.setState({started: true}, this.props.singleFeed())
    };

    onFeedStop = () => {
        this.props.stopFeed()
    };

    render() {
        const {feedStatus} = this.props;
        if (feedStatus.pending) {
            return (
                <div>
                    <Button onClick={this.onFeedStart} disabled>Start</Button>
                    <Button onClick={this.onFeedStop} disabled>Stop</Button>
                </div>
            )
        } else if (feedStatus.rejected) {
            return <div>Error</div>
        } else if (feedStatus.fulfilled) {
            if (feedStatus.value.status) {
                return (
                    <ButtonToolbar>
                        <ButtonGroup>
                            <Button onClick={this.onFeedStart} disabled variant="success">Last Page: {feedStatus.value.status.lastPage}</Button>
                            <Button onClick={this.onFeedStop} active variant="warning">Stop</Button>
                            <Button diabled variant="info">{feedStatus.value.status.pagesProcessed}</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                )
            } else {
                return (
                    <ButtonToolbar>
                        <ButtonGroup>
                            <Button onClick={this.onFeedStart} active>Start</Button>
                            <Button onClick={this.onFeedStop} disabled variant="secondary">Stop</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                )
            }
        }
    }
}

export default connect(props => ({

    startFeed: () => ({
        startFeedResponse: {url: `/feedjobmanager/addFeed/${props.feedName}`}
    }),
    stopFeed: () => ({
        stopFeedResponse: {url: `/feedjobmanager/disableFeed/${props.feedName}`}
    }),
    feedStatus: {
        url: `/feedjobmanager/getStatus/${props.feedName}`
    },

}))(ToolBar)

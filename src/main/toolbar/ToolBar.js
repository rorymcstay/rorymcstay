import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import {Grid} from "semantic-ui-react";
import Button from "react-bootstrap/Button";

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

    onFeedStop = () => {
        this.props.stopFeed()
    };

    onNewFeed = (e, {value}) => {
        this.setState({feedName: value}, this.props.newFeed(value))
    };

    render() {
        const {feedStatus} = this.props;
        if (feedStatus.pending) {
            return (
                <Grid>
                    <div>
                        <Button onClick={this.onFeedStart} disabled>Start</Button>
                        <Button onClick={this.onFeedStop} disabled>Stop</Button>
                    </div>
                </Grid>
            )
        } else if (feedStatus.rejected) {
            return <div>Error</div>
        } else if (feedStatus.fulfilled) {
            if (feedStatus.value.status) {
                return (
                    <Grid.Column>
                        <Button onClick={this.onFeedStart} disabled>Start</Button>
                        <Button onClick={this.onFeedStop} active>Stop</Button>
                    </Grid.Column>
                )
            } else {
                return (
                    <Grid.Column>
                        <Button onClick={this.onFeedStart} active>Start</Button>
                        <Button onClick={this.onFeedStop} disabled>Stop</Button>
                    </Grid.Column>
                )
            }
        }
    }
}

export default connect(props => ({
    newFeed: (value) => ({
        newFeedResponse: {url: `/feedmanager/newFeed/${value}`}
    }),
    startFeed: () => ({
        startFeedResponse: {url: `/feedmanager/startFeed/${props.feedName}`}
    }),
    stopFeed: () => ({
        stopFeedResponse: {url: `/feedmanager/stopFeed/${props.feedName}`}
    }),
    feedStatus: {
        url: ` feedmanager/feedStatus/${props.feedName}`, refreshInterval: 10000
    }
}))(ToolBar)
import React, {Component} from 'react';
import connect from "../../api-connector";
import Button from "react-bootstrap/Button";
import {ButtonGroup, ButtonToolbar} from "react-bootstrap";

class ToolBar extends Component {

    constructor(props) {
        super(props);
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
    onRefreshHistory= () => {
        this.setState({started: true}, this.props.refreshHistory())
    };
    clearErrors = () => {
        this.setState({started: true}, this.props.clearErrors())
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
                            <Button onClick={this.onFeedStop} active variant="warning">Stop</Button>
                            <Button onClick={this.onRefreshHistory} active variant="warning">Refresh History</Button>
                            <Button onClick={this.clearErrors} active variant="warning">Clear Errors</Button>
                            <Button disabled variant="info">{feedStatus.value.status.pagesProcessed}</Button>
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

    refreshHistory: () => ({
        refreshResponse: {url: `/feedmanager/refreshHistory/${props.actionChainName}`}
    }),
    clearErrors: () => ({
        clearErrorsResponse: {url: `/feedmanager/clearActionErrorReports/${props.actionChainName}`, method: 'DELETE'}
    }),
    stopFeed: () => ({
        stopFeedResponse: {url: `/feedmanager/disableFeed/${props.actionChainName}`}
    }),
    feedStatus: {
        url: `/feedmanager/getStatus/${props.actionChainName}`
    }

}))(ToolBar)

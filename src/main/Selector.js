import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import connect from "../api-connector";
import {Dropdown, Grid} from "semantic-ui-react";

import ToolBar from "./toolbar/ToolBar";
import {ButtonToolbar, Button, InputGroup, FormControl, ButtonGroup} from "react-bootstrap";

class Selector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            feedName: props.feedName,
            actionChain: props.actionChainName,
            started: false
        }
    }

    onFeedChange = (e, {value}) => {
        this.setState({feedName: value}, this.props.onFeedChange(value))
    };

    onNewFeedWrite = (event) => {
        this.setState({feedName: event.target.value}, this.props.onFeedChange(event.target.value))
    };

    onActionChainChange = (e, {value}) => {
        this.setState({actionChainName: value}, this.props.onActionChainChange(value));
    }
    
    getMenuOptions( req )
    {
        const menuOptions = [];
        for (let i = 0; i < req.value.length; i++) {
            menuOptions.push({
                key: req.value[i],
                value: req.value[i],
                text: req.value[i]
            });
        }
        return menuOptions;
    }

    render() {
        const {fetchFeeds, actionChains} = this.props;
        if (fetchFeeds.pending || fetchFeeds.pending) {
            return <ReactLoading/>
        } else if (fetchFeeds.rejected || actionChains.rejected) {
            return <div>Error</div>
        } else if (fetchFeeds.fulfilled && actionChains.fulfilled) {

            const feedMenuOptions = this.getMenuOptions(fetchFeeds);
            const actionChainMenuOptions = this.getMenuOptions(actionChains);

            return (
                <Grid columns='equal' relaxed>
                    <Grid.Column>
                        <Dropdown
                            placeholder='Select ActionChain'
                            fluid
                            search
                            selection
                            onChange={this.onActionChainChange}
                            options={actionChainMenuOptions}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Dropdown
                            placeholder='Select Feed'
                            fluid
                            search
                            selection
                            onChange={this.onFeedChange}
                            options={feedMenuOptions}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <ButtonToolbar>
                            <InputGroup>
                            <FormControl
                                   type='text'
                                   placeholder='Create...'
                                   onChange={this.onNewFeedWrite}
                            /></InputGroup>
                            <ButtonGroup>
                            <Button onClick={() => this.props.newFeed(this.state.feedName)} active>New</Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Grid.Column>
                </Grid>
            );
        } else {
            return <ReactLoading/>;
        }
    }
}

export default connect(props => ({
    fetchFeeds: {
        url: `/feedmanager/getFeeds/`
    },
    actionChains: {
        url: `/actionsmanager/getActionChains/`
    },
    newFeed: (value) => ({
        newFeedResponse: {
            url: `/feedmanager/newFeed/${value}`
        }
    }),
}))(Selector)

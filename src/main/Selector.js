import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import {Dropdown, Grid} from "semantic-ui-react";

import ToolBar from "./toolbar/ToolBar";
import {ButtonToolbar, Button, InputGroup, FormControl, ButtonGroup} from "react-bootstrap";

class Selector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            feedName: props.feedName,
            started: false
        }
    }

    onFeedChange = (e, {value}) => {
        this.setState({feedName: value}, this.props.onFeedChange(value))
    };

    onNewFeed = (value) => {
        this.setState({feedName: value}, this.props.newFeed(value))
    };

    render() {
        const {fetchFeeds} = this.props;
        if (fetchFeeds.pending) {
            return <ReactLoading/>
        } else if (fetchFeeds.rejected) {
            return <div>Error</div>
        } else if (fetchFeeds.fulfilled) {
            const menuOptions = [];
            for (let i = 0; i < fetchFeeds.value.length; i++) {
                menuOptions.push({
                    key: fetchFeeds.value[i],
                    value: fetchFeeds.value[i],
                    text: fetchFeeds.value[i]
                });
            }

            return (
                <Grid columns='equal' relaxed>
                    <Grid.Column>
                        <Dropdown
                            placeholder='Select Feed'
                            fluid
                            search
                            selection
                            onChange={this.onFeedChange}
                            options={menuOptions}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <ButtonToolbar>
                            <InputGroup>
                            <FormControl
                                   type='text'
                                   placeholder='Create...'
                                   onChange={(e, {value}) => this.setState({newFeedName: value})}
                            /></InputGroup>
                            <ButtonGroup>
                            <Button onClick={() => this.onNewFeed(this.state.newFeedName)} active>New</Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Grid.Column>
                </Grid>
            )
        }
    }
}

export default connect(props => ({
    fetchFeeds: {
        url: `/feedmanager/getFeeds`
    },
    newFeed: (value) => ({
        newFeedResponse: {url: `/feedmanager/newFeed/${value}`}
    }),
}))(Selector)
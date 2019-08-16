import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import {Dropdown, Grid, Input} from "semantic-ui-react";
import Button from "react-bootstrap/Button";
import ToolBar from "./toolbar/ToolBar";

class Selector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            feedName: props.feedName,
            searchField: "",
            searchString: "",
            started: false
        }
    }

    onFeedChange = (e, {value}) => {
        this.setState({feedName: value}, this.props.onFeedChange(value))
    };

    render() {
        const {fetchFeeds, startFeedResponse} = this.props;
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
                <Grid columns={3}>
                    <Grid.Column width={8}>
                        <Dropdown
                            placeholder='Select Feed'
                            fluid
                            search
                            selection
                            onChange={this.onFeedChange}
                            options={menuOptions}
                        />
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Input focus
                               placeholder='Search...'
                               onChange={(e, {value}) => this.setState({"feedName": value})}
                        />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button onClick={this.onNewFeed} active>New</Button>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <ToolBar feedName={this.state.feedName}/>
                    </Grid.Column>
                </Grid>
            )
        }
    }
}

export default connect(props => ({
    fetchFeeds: {
        url: `/feedmanager/getFeeds/`
    }
}))(Selector)
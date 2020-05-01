import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import connect from "../api-connector";
import {Dropdown, Grid} from "semantic-ui-react";

import {ButtonToolbar, Button, FormControl } from "react-bootstrap";

class Selector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionChain: props.actionChainName,
            started: false
        }
    }

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
        const {actionChains} = this.props;
        if (actionChains.pending) {
            return <ReactLoading/>
        } else if (actionChains.rejected) {
            return <div>Error</div>
        } else if (actionChains.fulfilled) {

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
                        <ButtonToolbar>
                            <Button onClick={() => this.props.onNew()} active>New</Button>
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
    actionChains: {
        url: `/actionsmanager/getActionChains/`
    }
}))(Selector)

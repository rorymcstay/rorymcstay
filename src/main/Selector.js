import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import connect from "../api-connector";


// router integration
import {Link, withRouter } from "react-router-dom";
import queryString from 'query-string';

// ui-componets
import {ButtonToolbar, Button, FormControl } from "react-bootstrap";
import {Dropdown, Grid} from "semantic-ui-react";

class Selector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionChainName: props.actionChainName,
            started: false
        }
    }

    onActionChainChange = (e, {value}) => {
        this.props.onActionChainChange(value);
        this.updateCurrentUrlParams(value);
        this.setState({actionChainName: value});
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

    updateCurrentUrlParams = (value) =>
    {
        const oldParams = queryString.parse(this.props.location.search);
        oldParams.chain = value;
        const newUrlParams = queryString.stringify(oldParams);
        console.log(`newUrlParams=[${newUrlParams}]`);
        this.props.history.push({pathname: this.props.location.pathname, search: `${newUrlParams}`});
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
                            value={this.state.actionChainName}
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
        url: `/actionsmanager/getUserActionChains/`
    }
}))(withRouter(Selector))

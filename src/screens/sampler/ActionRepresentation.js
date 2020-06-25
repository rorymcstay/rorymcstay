import React, {Component} from "react";
import connect from '../../api-connector';
import { Card } from 'react-bootstrap';
import { Button, ButtonGroup} from 'semantic-ui-react';


class ActionRepresentation extends Component
{
    constructor(props)
    {
        console.log(`ActionRepresentation: ${props.actionParams.actionType}`);
        super(props);
        this.state = {
            inFocus: false,
            actionParams: props.actionParams,
            index: props.index,
            errorReport: {},
            error: false
        }
    }

    componentWillReceiveProps(nextProps)
    {
        
        const {actionReport} = nextProps;
        var error = false;
        var errorReport = {};
        if (actionReport.pending)
        {
            error = false;
        }
        else if (actionReport.fulfilled)
        {
            if (actionReport.value.length === 0)
            {
                error = false;
            } else {
                errorReport = actionReport.value[0];
                error = true;
            }
        }
        else {
            error = false;
        }
        this.setState(prevState => {
            prevState.actionParams = nextProps.actionParams;
            prevState.index = nextProps.index;
            prevState.error = error;
            prevState.errorReport = errorReport;
            return prevState;
        });
    }

    onDelete = () =>
    {
        this.props.onDelete(this.state.index);
    }

    onClick = () =>
    {
        this.props.onSelection(this.state.actionParams, this.state.index, this.state.errorReport);
        this.setState((prevState, props) => ({inFocus: !prevState.inFocus}));
    }
 
    disable = () =>
    {
        this.setState((prevState, props) => ({inFocus: false}));
    }

    render ()
    {

        console.log(`have action ${this.state.actionParams}`);
        return (
        <Card style={{ width: '12rem' }} bg={this.state.error === false ? 'primary' : 'danger'}>
            <Card.Body >
                <Card.Title>{this.props.actionParams.actionType}</Card.Title>
                <ButtonGroup size="mini">
                    <Button  onClick={this.onClick}>Focus</Button>
                    <Button onClick={this.onDelete}>Delete</Button>
                </ButtonGroup>
            </Card.Body>
        </Card>);
    }
}

export default connect ((props) => ({
    actionReport: {
        url: `/feedmanager/findActionErrorReports/${props.actionChainName}/${props.index}`
    }
}))(ActionRepresentation)

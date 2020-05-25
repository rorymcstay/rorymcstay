import React, {Component} from "react";
import connect from '../../../api-connector';
import ReactLoading from "react-loading";
import { Card, InputGroup } from 'react-bootstrap';
import { Checkbox, Input, Button, ButtonGroup} from 'semantic-ui-react';


class ActionRepresentation extends Component
{
    constructor(props)
    {
        console.log(`ActionRepresentation: ${props.actionParams.actionType}`);
        super(props);
        this.state = {
            inFocus: false,
            actionParams: props.actionParams,
            index: props.index
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState(prevState => {
            prevState.actionParams = nextProps.actionParams;
            prevState.index = nextProps.index;
            return prevState;
        });
    }

    onDelete = () =>
    {
        this.props.onDelete(this.state.index);
    }

    onClick = () =>
    {
        this.props.onSelection(this.state.actionParams, this.state.index);
        this.setState((prevState, props) => ({inFocus: !prevState.inFocus}));
    }
 
    disable = () =>
    {
        this.setState((prevState, props) => ({inFocus: false}));
    }

    render ()
    {
        const {actionReport} = this.props;
        var error = true;
        if (actionReport.pending)
        {
            return <ReactLoading/>
        }
        else if (actionReport.fulfilled)
        {
            if (actionReport.value.length === 0)
            {
                error = false;
            } else {
                error = true;
            }
        }
        else {
            error = false;
        }
        console.log(`have action ${this.state.actionParams}`);
        return (
        <Card style={{ width: '12rem' }} bg={error == false ? 'primary' : 'danger'}>
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
        url: `/actionsmanager/findActionErrorReports/${props.actionChainName}/${props.index}`
    }
}))(ActionRepresentation)

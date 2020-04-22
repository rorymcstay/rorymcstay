import React, {Component} from "react";
import Form from "react-jsonschema-form";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';

import { Header, Icon, Image, Menu, Input, Segment, Sidebar } from 'semantic-ui-react';

class ActionChain extends Component
{

}

class ActionParameter extends Component
{
    constructor(props)
    {
        this.state = {
            name: props.name,
            value: props.name,
            inFocus: false,
            freeForm: true
        }
        if (props.values)
        {
            this.state.values = props.values;
            this.state.freeForm = false;
        }
    }

    onClick = () =>
    {
        this.setState((prevState, props) => ({inFocus: !prevState.value}));
    }

    setValue = (value) =>
    {
        if (this.inFocus)
        {
            this.setState({value: value});
        }
    }
    renderField = () =>
    {
        if (this.state.freeForm)
        {
            return <Input disabled={!this.state.inFocus}></Input>;
        } else {
            return (<Dropdown
                placeholder='Select Feed'
                fluid
                search
                selection
                disabled={!this.state.inFocus}
                onChange={this.onActionTypeChange}
                options={actionTypes.value}
            />);
        }
    }

    render ()
    {
    return (
        <div>
            {this.renderField()}
            <Button onClick={this.onClick}>select</Button>
        </div>
    }

}

class ActionView extends Component
{ 
    constructor(props)
    {
        this.state = {
            parameters: {},
            actionType: undefined,
            focus: undefined,

        };
    }

    onActionTypeChange = (event) =>
    {
        this.props.getActionFields(event);

    }

    render()
    {
        const {actionTypes, params} = this.props;
        var selector = undefined;
        if (actionTypes.rejected)
        {
            selector = <div>Error</div>;
        } 
        else if (actionTypes.pending)
        {
            selector = <ReactLoading>Types loading...</ReactLoading>;
        }
        else if (actionTypes.fulfilled)
        {
            selector = <Dropdown
                placeholder='Select Feed'
                fluid
                search
                selection
                onChange={this.onActionTypeChange}
                options={actionTypes.value}
            />;
        }
        if (params)
        {
            if (params.pending)
            {

            }
            else if (params.rejected)
            {

            } 
            else if (params.fulfilled)
            {
                
            }

        }
        return selector;
    }
}

    export default connect(props =>({
        actionTypes: {
            url: '/actionsmanager/getActionTypes/'
        },
        getActionFields: (actionType) => ({
            params: {
                url: `/actionsmanager/getActionFields${actionType}`
            }
        })
}))(ActionView)

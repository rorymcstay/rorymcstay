import React, {Component} from "react";
import Form from "react-jsonschema-form";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Dropdown, Grid, Button, ButtonGroup } from 'semantic-ui-react';

import { Header, Icon, Image, Menu, Input, Segment, Sidebar } from 'semantic-ui-react';

class ActionViewerParameter extends Component
{
    constructor(props)
    {
        this.state = {
            name: props.name,
            value: props.value,
            inFocus: props.infocus,
            freeForm: props.freeForm
        }
        if (props.values)
        {
            this.state.values = props.values;
            this.state.freeForm = false;
        }
    }

    onClick = () =>
    {
        this.props.clearOthers();
        this.setState((prevState, props) => ({inFocus: !prevState.value}));
    }

    setValue = (value) =>
    {
        if (this.state.inFocus && this.state.freeForm)
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
                <Button onClick={this.onClick}>Edit</Button>
            </div>
        );
    }
}


class ActionViewer extends Component
{ 
    constructor(props)
    {
        const { parameters } = props;
        this.state = {
            actionName:  props.actionName,
            parameters: !parameters.fulfilled ? {} : parameters.value,
            actionType: props.actionType,
            focus: undefined
        };
    }

    onActionTypeChange = (event) =>
    {
        this.props.getActionFields(event);
    }

    onSubmit = (actionParams) =>
    {
        this.props.saveAction(actionParams);
    }

    render()
    {
        const {actionTypes, params, possibleValues} = this.props;
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
            // TODO: render data then the selector
            selector = <Dropdown
                placeholder='Select Action Type'
                fluid
                search
                selection
                onChange={this.onActionTypeChange}
                options={actionTypes.value}
            />;
        }
        var actionParams = [];
        for (param in paramFields)
        {
            const freeForm = true ? (param.name === 'css' || param.name ==='xpath' || param.name === 'text') : false;
            actionParams.push(<ActionViewerParameter name={param.name} 
                                                     freeForm={freeForm} 
                                                     value={params[param.name]}
                                                     values={this.props.possibleValues[param.name]} />);
        }
 
        return <div>{selector} {actionParams}</div>;
    }
}

export default connect(props =>({
    actionTypes: {
        url: '/actionsmanager/getActionTypes/'
    },
    possibleValues: {
        url: `actionsmanager/getPossibleValues/`
    },
    getActionFields: (actionType) => ({
        paramFields: {
            url: `/actionsmanager/getActionFields/${actionType}`
        }
    })
}))(ActionViewer)

import React, {Component} from "react";
import Form from "react-jsonschema-form";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Dropdown, Grid, Button, ButtonGroup } from 'semantic-ui-react';

import  {Input} from 'semantic-ui-react';

class ActionViewerParameter extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            key: props.name, 
            name: props.name,
            value: props.value,
            values: (props.values === undefined) ? [] : props.values,
            freeForm: (props.values === undefined) ? true : false
        }
    }

    componentWillReceiveProps(nextProps)
    {
        var value;
        if (this.state.inFocus)
        {
            value = nextProps.value;
        }
        else
        {
            value = this.state.value;
        }
         this.setState({
            key: nextProps.name, 
            name: nextProps.name,
            value: value,
            values: (nextProps.values === undefined) ? [] : nextProps.values,
            freeForm: (nextProps.values === undefined) ? true : false,
         });
    }

    onClick = () =>
    {
        this.setState((prevState, props) => ({inFocus: !prevState.inFocus}));
    }

    onSelectionChange = (e, {value}) => {
        this.setState({value: value, inFocus: true});
        console.log(`target value: ${value}, target name: ${this.state.key}`);
        this.props.onChange( this.state.key,  value);
    }

    onChange = (e, {value}) =>
    {
        this.setState({value: value, inFocus: true});
        console.log(`target value: ${value}, target name: ${this.state.key}`);
        this.props.onChange( this.state.key,  value);
    }

    getMenuOptions( req )
    {
        const menuOptions = [];
        for (let i = 0; i < req.length; i++) {
            menuOptions.push({
                key: req[i],
                value: req[i],
                text: req[i]
            });
        }
        return menuOptions;
    }

    renderField = () =>
    {
        if (this.state.freeForm)
        {
            return (<Input 
                        placeholder={this.state.name} 
                        onChange={this.onChange} 
                        label={this.state.name}
                        value={this.state.value} 
                        key={this.state.name} 
                        disabled={!this.state.inFocus}>
                    </Input>);
        } else {
            return (<Dropdown
                placeholder={this.state.name}
                labelled
                label={this.state.name}
                fluid
                value={this.state.value}
                search
                selection
                disabled={!this.state.inFocus}
                onChange={this.onSelectionChange}
                options={this.getMenuOptions(this.state.values)}
            />);
        }
    }

    render ()
    {
        return (
            <div width='100%'>
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
        super(props);
        this.state = {
            actionParameters: props.actionParameters,
            position: props.position
        };
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            actionParameters: nextProps.actionParameters,
            position: nextProps.position
        });
    }

    onActionParameterChange = (key, value)  =>
    {
        /*
         * TODO prevState is undefined in firefox here. Why?*/
        this.setState(prevState => {
            prevState.actionParameters[key] = value;
            return {actionParameters: prevState.actionParameters};
        });
        console.log(`will update parent  with ${this.state.actionParameters[key]}`);
        this.props.onUpdateAction(this.state.actionParameters);
    }

    onActionTypeChange = (e) =>
    {
        this.props.getActionFields(e);
    }

    onSubmit = (actionParams) =>
    {
        this.props.saveAction(actionParams);
    }

    render()
    {
        const {possibleValues} = this.props;
        var actionParams = [];
        if (possibleValues.rejected)
        {
            return <div>Error</div>;
        }
        else if (possibleValues.pending)
        {
            return <ReactLoading/>;
        }
        else if (possibleValues.fulfilled)
        {

            for (var name in this.props.actionParameters)
            {
                const value = this.props.actionParameters[name];
                const freeForm = true ? (name === 'css' || name ==='xpath' || name === 'text') : false;
                actionParams.push(<ActionViewerParameter name={name}
                                                         key={name}
                                                         onChange={this.onActionParameterChange}
                                                         freeForm={freeForm}
                                                         value={value}
                                                         values={possibleValues.value[name]} />);
            }
        } 
        return <div>{actionParams}</div>;
    }
}

export default connect(props =>({
    possibleValues: {
        url: `actionsmanager/getPossibleValues/`
    }
}))(ActionViewer)

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
        this.setState({value: value});
    }

    onChange = (e, {target}) =>
    {
        this.setState({value: e.target.value, inFocus: true});
        console.log(e);
        console.log(`target value: ${e.target.value}, target name: ${e.target.name}`);
        this.props.onChange( this.state.key,  e.target.value);
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

    componentWillReceiveProps = (nextProps) =>
    {
        this.setState({
            actionParameters: nextProps.actionParameters,
            position: nextProps.position
        });
    }

    onActionParameterChange = (key, value)  =>
    {
        this.setState((prevState, props) => {
            console.log(prevState);
            prevState.actionParameters[key] = value;
            return {actionParameters: prevState.actionParameters};
        });
        this.onUpdateAction(this.state.position);
    }

    onUpdateAction = (key) =>
    {
        this.props.updateAction(this.state.actionParameters, key);
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
        return <div><Button onClick={this.onUpdateAction}>Update</Button>{actionParams}</div>;
    }
}

export default connect(props =>({
    possibleValues: {
        url: `actionsmanager/getPossibleValues/`
    }
}))(ActionViewer)

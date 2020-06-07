import React, {Component} from "react";
import connect from '../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import { Label, Dropdown,  Button } from 'semantic-ui-react';

import  {Input, Checkbox} from 'semantic-ui-react';

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
        if (this.state.inFocus || !nextProps.selectorTriggered)
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
            //freeForm: (nextProps.values === undefined) ? true : false,
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

    render()
    {
        console.log(`ActionViewerParameter::render(): name=[${this.state.name}], value=[${this.state.value}], freeForm=[${this.state.freeForm}]`)
        if (this.state.name == 'isSingle')
        {
            return (
                <div>
                    <Checkbox  
                        label='isSingle'
                        size='tiny'
                        key={this.state.key}
                        disabled={!this.state.inFocus}
                        onChange={() => { this.props.onChange(this.state.key, !this.state.value) }}
                        placeholder='isSingle'
                        checked={this.state.value}/>
                    <Button size='mini' onClick={this.onClick}>Edit</Button>
                </div>
            );
        }
        if (this.state.freeForm)
        {
            return (
                <div>
                    <Input 
                        placeholder={this.state.name} 
                        onChange={this.onChange} 
                        label={this.state.name}
                        size='mini'
                        value={this.state.value} 
                        key={this.state.name} 
                        disabled={!this.state.inFocus}>
                    </Input>
                    <Button size='mini' onClick={this.onClick}>Edit</Button>
                </div>
            );
        } else {
            console.log(`rendering non free form name=[${this.state.name}]`)
            return (
                <div>
                    <Dropdown
                        placeholder={this.state.name}
                        label={this.state.name}
                        fluid
                        value={this.state.value}
                        search
                        selection
                        size='mini'
                        disabled={!this.state.inFocus}
                        onChange={this.onSelectionChange}
                        options={this.getMenuOptions(this.state.values)}
                    />
                    <Button size='mini' onClick={this.onClick}>Edit</Button>
                </div>
            );
        }
    }
}


class ActionErrorReport extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            errorType: props.report.errorType
        };
    }

    render ()
    {
        return <Label color='red'>{this.state.errorType}</Label>;
    }
}


class ActionViewer extends Component
{ 
    constructor(props)
    {
        super(props);
        this.state = {
            actionParameters: props.actionParameters,
            position: props.position,
            report: props.currentActionErrorReport
        };
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            actionParameters: nextProps.actionParameters,
            position: nextProps.position,
            report: nextProps.currentActionErrorReport
        });
    }

    onActionParameterChange = (key, value)  =>
    {
        /*
         * TODO prevState is undefined in firefox here. Why?*/
        this.setState(prevState => {
            prevState.actionParameters[key] = value;
            return prevState
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
        // filter the actionParams so that only parameters which are in the manadory
        // params list are submitted.
        const minimalParams = Object.keys(actionParams).filter(
                                key => this.props.mandatoryParams.value
                                    .includes(key))
                                    .reduce((obj, key) => {
                                        obj[key] = actionParams[key];
                                        return obj
                                    }, {}); 
        this.props.saveAction(minimalParams);
    }

    render()
    {
        const {mandatoryParams, possibleValues} = this.props;
        var actionParams = [];
        if (possibleValues.rejected || mandatoryParams.rejected)
        {
            return <div>Error</div>;
        }
        else if (possibleValues.pending || mandatoryParams.pending)
        {
            return <ReactLoading/>;
        }
        else if (possibleValues.fulfilled && mandatoryParams.fulfilled)
        {
            for(var param in mandatoryParams.value)
            {
                if (this.props.actionParameters[mandatoryParams.value[param]] === undefined)
                {
                    this.props.actionParameters[mandatoryParams[param]] = '';
                }
            }
            for (var name in this.props.actionParameters)
            {
                const value = this.props.actionParameters[name];
                if (mandatoryParams.value.indexOf(name) == -1)
                {
                    continue;
                }
                const freeForm = (name === 'css' || name ==='xpath' || name === 'text' || name === 'inputString') ? true : false;
                console.log(`ActionViewer::render(): name=[${name}], freeForm=[${freeForm}], value=[${value}]`)
                actionParams.push(<ActionViewerParameter name={name}
                                                         selectorTriggered={this.props.selectorTriggered}
                                                         key={name}
                                                         onChange={this.onActionParameterChange}
                                                         freeForm={freeForm}
                                                         value={value}
                                                         values={possibleValues.value[name]} />);
            }
            let difference = mandatoryParams.value.filter(x => !Object.keys(this.props.actionParameters).includes(x));
            for (var mand in difference)
            {
                const name = difference[mand];
                const freeForm = (name === 'css' || name ==='xpath' || name === 'text' || name === 'inputString') ? true : false;
                console.log(`ActionViewer::render(): Missing mandatory param: name=[${name}], freeForm=[${freeForm}]`)
                actionParams.push(<ActionViewerParameter name={name}
                                                         selectorTriggered={this.props.selectorTriggered}
                                                         key={name}
                                                         onChange={this.onActionParameterChange}
                                                         freeForm={freeForm}
                                                         value={''}
                                                         values={possibleValues.value[name]} />);
            }
        }
        else
        {
            return <ReactLoading/>;
        }
        if (actionParams.length === 0)
        {
            return <div>Focus on an Action</div>;
        }
        if (this.state.report.errorType)
        {
            actionParams.push(<ActionErrorReport report={this.state.report}/>);
        }
        return <>{actionParams}</>;
    }
}

export default connect(props =>({
    possibleValues: {
        url: `/actionsstaticdata/getPossibleValues/`
    },
    mandatoryParams: {
        url: `/actionsstaticdata/getActionParameters/${props.actionParameters.actionType}`
    }
}))(ActionViewer)

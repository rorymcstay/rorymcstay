import React, {Component} from "react";
import connect from '../../../api-connector';
import ReactLoading from "react-loading";
import { Checkbox, Input, Button, ButtonGroup} from 'semantic-ui-react';
import { Card, InputGroup } from 'react-bootstrap';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { useAlert } from 'react-alert'; 
// router integration
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';


const EMPTY_ACTION = {
    actionType: 'CaptureAction',
    isSingle: false,
    css: '',
    xpath: '',
    text: '',
    //TODO: attribute should be predetermined list of possible values, be it predictions or 
    //actuals. eg: href and class src are obvious ones but not necessarily there
    attribute: ''
}

const EMPTY_CHAIN_PARAMS = {
    startUrl: undefined,
    name: undefined,
    isRepeating: true
}

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
        console.log(`have action ${this.state.actionParams}`);
        return (
        <Card style={{ width: '12rem' }}>
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


class ActionChainsToolBar extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            startUrl: props.startUrl,
            actionChainName: props.actionChainName,
            isRepeating: props.isRepeating
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            startUrl: nextProps.startUrl,
            actionChainName: nextProps.actionChainName,
            isRepeating: nextProps.isRepeating
        });
    }

    onNewAction = () => {
        this.props.onNewAction();
    }

    onSubmit = () =>
    {
        this.props.onSubmitAction(this.state.actionChainName, this.state.startUrl, this.state.isRepeating);
    }

    render ()
    {
        console.log(`rendering startUrl=${this.state.startUrl}, actionChainName=${this.state.actionChainName}, isRepeating=${this.state.isRepeating} `);
        return (<div>
            <ButtonGroup vertical>
                <Button size='tiny' onClick={ () => {this.onSubmit()}}>SubmitChain</Button>
                <Button size='tiny' onClick={ () => {this.onNewAction()}}>NewAction</Button>
                <Button size='tiny' onClick={ () => this.props.reloadSampleUrl(this.props.actionChainName) }>RefreshSample</Button>
                <Button size='tiny' onClick={this.props.reloadSource}>Reload</Button>
            </ButtonGroup>
            <InputGroup >
                <Input onChange={(e) => {this.props.onToolbarValChange(e.target.value, 'actionChainName')}} placeholder='Name' value={this.state.actionChainName}/>
                <Input onChange={(e) => {this.props.onToolbarValChange(e.target.value, 'startUrl')}} placeholder='StartUrl' value={this.state.startUrl}/>
                <Checkbox label='isRepeating' onChange={(e) => {this.props.onToolbarValChange(!this.state.isRepeating, 'isRepeating')}} placeholder='isRepeating' checked={this.state.isRepeating}/>
            </InputGroup>
        </div>);
    }
}

class ActionChain extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            actions: props.actions,
            startUrl: props.startUrl,
            notified: false,
            isRepeating: props.isRepeating,
            actionChainName: props.actionChainName,
            currentPosition: 0
        }
    }


    componentWillReceiveProps(nextProps)
    {
        if (!this.state.loaded)
        {
            this.setState({
                loaded: true,
                actions: nextProps.actions,
                startUrl: nextProps.startUrl,
                isRepeating: nextProps.isRepeating,
                actionChainName: nextProps.actionChainName
            });
        }
    }

    updateCurrentUrlParams = (value) =>
    {
        const oldParams = queryString.parse(this.props.location.search);
        oldParams.position= value;
        const newUrlParams = queryString.stringify(oldParams);
        console.log(`newUrlParams=[${newUrlParams}]`);
        this.props.history.push({pathname: this.props.location.pathname, search: `${newUrlParams}`});
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState( prevState => {
            if (prevState.currentPosition == oldIndex)
            {
                prevState.currentPosition = newIndex;
                this.props.onPositionChange(newIndex);
            }
            prevState.actions = arrayMove(prevState.actions, oldIndex, newIndex);
            return prevState;
        });
    };

    onDelete = (index) =>
    {
        this.setState((prevState, props) => {
            prevState.actions.splice(index, 1);
            return {actions: prevState.actions};
        });
    }

    onActionFocus = (actionParams, index) =>
    {
        this.setState({currentPosition: index}, this.props.onActionFocus(actionParams, index));
        this.updateCurrentUrlParams(index);
    }

    Chain = SortableContainer(({actions}) => {
        //var counter = 0;
        console.log(`returning actionlist of length ${actions.length}`);
        const Node = SortableElement(({value}) => <ActionRepresentation 
            onDelete={this.onDelete} 
            onSelection={this.onActionFocus} 
            actionParams={value.value} 
            index={value.index}/>);

        return (
            <ul>
            {actions.map((value, index) => { 
                const actionRepresentation = {value: value, index: index};
                return <Node index={index} key={value.css} value={actionRepresentation}/> 
            })}
            </ul>
        );
    });

    getActionParams = () =>
    {
        if (this.props.selected)
        {
            const {actionChainParams}  = this.props;
            const chain = this.loadParams(actionChainParams);
            const params = {
                actionChainName: chain.name,
                actions: chain.actions,
                startUrl: chain.startUrl
            }
            return params;
        }
        else
        {
            const {newActionchain}  = this.props;
            const chain = this.loadParams(newActionchain);
            const params = {
                actionChainName: chain.name,
                actions: chain.actions,
                startUrl: chain.startUrl
            }
            return params;
        }
    }

    loadParams (params)
    {
        if (!params.fulfilled)
        {
            return {};
        }
        else
        {
            return params.value;
        }
    }


    onSubmitActionChain = (actionChainName, url, isRepeating) =>
    {
        const payload = {
            saved: true,
            startUrl: url,
            isRepeating: isRepeating,
            actions: this.state.actions,
            name: actionChainName
        }
        this.props.submitActionChain(payload);
        this.setState({saved: true, notified: false});
    }

    onUpdateStartUrl = (url) =>
    {
        this.props.onUpdateStartUrl(url);
        this.setState({
            startUrl: url
        })
    }
    onUpdateName = (actionChainName) =>
    {
        this.props.onUpdateName(actionChainName);
        this.setState({
            actionChainName: actionChainName 
        });
    }

    onToolbarValChange = (val, key) =>
    {
        this.props.onToolbarValChange(val, key);
        this.setState(prevState => {
            prevState[key] = val;
            return prevState;
        });
    }

    newAction = () =>
    {
        const action = JSON.parse(JSON.stringify(EMPTY_ACTION));
        console.log(`#### ActionType=${action.actionType}`);
        return action;
    }

    onNewAction = () =>
    {
        this.setState((prevState, props) => {
            prevState.actions.push(this.newAction());
            return {actions: prevState.actions};
        });
    }


    submissionInfo = (submitAction) =>
    {
        if (submitAction === undefined)
        {
        }
        else 
        {
            if (submitAction.pending)
            {
                //this.setState({loading: true});
            }
            else if (!this.state.notified && submitAction.rejected)
            {
                this.props.alert.show(`Failed to communicate with Actions manager`);
                this.setState({notified: true});
            } 
            else
            {
                if (!this.state.notified && !submitAction.value.valid)
                {
                    this.props.alert.show(`Invalid Chain: ${submitAction.value.reason}`);
                    this.setState({notified: true});
                }
                else if (!this.state.notified)
                {
                    this.props.alert.show(`Success: ${submitAction.value.message}`);
                    this.setState({notified: true});
                }
                else
                {}
                
            }
        }
    }

    render ()
    {
        // TODO: ActionChain tool bar
        // TODO: render a list of actions
        console.log(`rendering actionchain actions.length=${this.props.actions.length} actionChainName=${this.props.actionChainName} startUrl=${this.props.startUrl}`);
        const {submitAction, reloadSample} = this.props;
        this.submissionInfo(submitAction);
        this.submissionInfo(reloadSample);


        return (
            <div>
                <ActionChainsToolBar 
                    reloadSampleUrl={this.props.reloadSampleUrl}
                    actionChainName={this.state.actionChainName}
                    startUrl={this.state.startUrl}
                    isRepeating={this.state.isRepeating}
                    onNewAction={this.onNewAction}
                    reloadSource={this.props.reloadSource}
                    onSubmitAction={this.onSubmitActionChain}
                    onUpdateName={this.props.onUpdateName}
                    onToolbarValChange={this.onToolbarValChange}
                    onUpdateStartUrl={this.state.onUpdateStartUrl}
                />
                <this.Chain actions={this.state.actions} onSortEnd={this.onSortEnd}/> 
            </div>
        );
    }
}
export default connect(props => ({
    submitActionChain: (payload) => ({
        submitAction: {
            url: `/actionsmanager/setActionChain/`,
            method: 'PUT',
            body: JSON.stringify(payload) 
        }
    }),
    reloadSampleUrl : (name) => ({
        reloadSample: {
        url: `/samplepages/requestSamplePages/${name}`
    }})
}))(withRouter(ActionChain))

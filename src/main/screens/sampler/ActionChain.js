import React, {Component} from "react";
import connect from '../../../api-connector';
//import { Input} from 'react-bootstrap';
import ReactLoading from "react-loading";
import { Input, Button} from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const EMPTY_ACTION = {
    actionType: 'CaptureAction',
    isSingle: false,
    css: undefined,
    xpath: undefined,
    text: undefined,
    //TODO: attribute should be predetermined list of possible values, be it predictions or 
    //actuals. eg: href and class src are obvious ones but not necessarily there
    attribute: undefined
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
        super(props)
        this.state = {
            inFocus: false,
            actionParams: props.actionParams
        }
    }

    onClick = () =>
    {
        this.props.onSelection(this.state.actionParams);
        this.setState((prevState, props) => ({inFocus: !prevState.inFocus}));
    }
 
    disable = () =>
    {
        this.setState((prevState, props) => ({inFocus: false}));
    }

    render ()
    {
        return (
        <Card>
            <Card.Body>
                <Card.Title>{this.state.actionParams.actionType}</Card.Title>
                <Button onClick={this.onClick}>Focus</Button>
            </Card.Body>
        </Card>);
    }
}


class ActionChainsToolBar extends Component
{
    constructor(props)
    {
        super(props)
        this.state={
            startUrl: props.startUrl,
            name: props.name,
            isRepeating: props.isRepeating
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            startUrl: nextProps.startUrl,
            name: nextProps.name,
            isRepeating: nextProps.isRepeating
        });
    }

    onNewAction = () => {
        this.props.onNewAction();
    }

    onSubmit = () =>
    {
        this.props.onSubmitAction(this.state.name, this.state.startUrl, this.state.isRepeating);
    }

    render ()
    {
        return (<div>
            <Button onClick={ () => {this.onSubmit()}}>SubmitChain</Button>
            <Button onClick={ () => {this.onNewAction()}}>NewAction</Button>
            <Input onChange={(e, {target}) => {this.props.onUpdateName(e.target.value)}} placeholder='Name' value={this.state.name}/>
            <Input onChange={(e, {target}) => {this.props.onUpdateStartUrl(e.target.value)}} placeholder='StartUrl' value={this.state.startUrl}/>
            <Input type='checkbox' label='isRepeating' placeholder='isRepeating' value={this.state.isRepeating}/>
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
            isRepeating: props.isRepeating,
            name: props.name
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            actions: nextProps.actions,
            startUrl: nextProps.startUrl,
            isRepeating: nextProps.isRepeating,
            name: nextProps.name
        });
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({actions}) => ({
            actions: arrayMove(actions, oldIndex, newIndex),
        }));
    };

    ActionNode = SortableElement(({value}) => <ActionRepresentation onSelection={this.props.onActionFocus} actionParams={value}/>);

    Chain = SortableContainer(({actions}) => {
        var counter = 0;
      return (
        <ul>
          {actions.map((value, index) => {  
              return <this.ActionNode key={counter++} index={index} value={value} />;
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
                name: chain.name,
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
                name: chain.name,
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

    onSubmitActionChain = (name, url, isRepeating) =>
    {
        const payload = {
            startUrl: url,
            isRepeating: isRepeating,
            actions: this.state.actions,
            name: name
        }
        this.props.submitActionChain(payload);
    }

    onNewAction = () =>
    {
        this.setState((prevState, props) => {
            prevState.actions.push(EMPTY_ACTION);
            return {actions: prevState.actions};
        });
    }

    render ()
    {
        // TODO: ActionChain tool bar
        // TODO: render a list of actions
        return (
            <div>
                <this.Chain actions={this.state.actions} onSortEnd={this.onSortEnd}/> 
                <ActionChainsToolBar 
                    name={this.state.name}
                    startUrl={this.state.startUrl}
                    isRepeating={this.state.isRepeating}
                    onNewAction={this.onNewAction}
                    onSubmitAction={this.onSubmitActionChain}
                    onUpdateName={this.props.onUpdateName}
                    onUpdateStartUrl={this.props.onUpdateStartUrl}
                />
            </div>
        );
    }
}
export default connect(props => ({
    submitActionChain: (payload) => ({
        submitAction: {
            url: `actionsmanager/setActionChain/`,
            method: 'PUT',
            body: JSON.stringify(payload) 
        }
    })
}))(ActionChain)
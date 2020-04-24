import React, {Component} from "react";
import Form from "react-jsonschema-form";
import connect from '../../../api-connector';
import "react-table/react-table.css";
import { Input} from '';
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react';
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
        this.props.onSelection();
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


const SortableItem = SortableElement(({value}) => <ActionRepresentation actionParams={value}/>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${value.css}`} index={index} value={value} />
      ))}
    </ul>
  );
});


class ActionChain extends Component
{
    constructor(props)
    {
        super(props)
    }
    
    componentDidMount()
    {
        this.setState((prevState, props) => ({startUrl: props.startUrl, name: props.name}));           
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
        items: arrayMove(items, oldIndex, newIndex),
        }));
    };

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

    onSubmitActionChain()
    {
        this.props.submitActionChain(this.state);
    }

    onNewAction()
    {
        this.setState((prevState, props) => {
            props.actions.push(EMPTY_ACTION);
            return {actions: prevState.actions};
        });
    }

    render ()
    {
        // TODO: ActionChain tool bar
        // TODO: render a list of actions
        const actionChain = this.getActionParams();
        const items = actionChain.actions;
        const {actionChainParams, newActionchain} = this.props;

        if (actionChainParams.pending || newActionchain.pending)
        {
            return <ReactLoading/>
        }
        else if (actionChainParams.rejected || newActionchain.pending)
        {
            return <div>Error loading actionParams</div>
        }
        else if (actionChainParams.fulfilled && newActionchain.fulfilled)
        {
            return (
                <div>
                    <SortableList items={items}/> 
                    <Button onClick={ () => {this.onNewAction()}}>NewAction</Button>
                    <Input placeholder='Name' value={actionChainParams.name}/>
                    <Input placeholder='StartUrl' value={actionChainParams.startUrl}/>
                    <Input type='checkbox' label='isRepeating' placeholder='isRepeating' value={actionChainParams.isRepeating}/>
                </div>
            );
        }
        else
        {
            return <ReactLoading/>;
        }
    }
}
export default connect(props => ({
    actionChainParams: {
        url: `actionsmanager/getActionChain/${props.actionChainName}`
    },
    newActionchain: {
        url: `actionsmanager/newActionSchema/`
    },
    submitActionChain: (payload) => ({
        submitAction: {
            url: `actionsmanager/setActionChain/`,
            method: 'PUT',
            body: JSON.stringify(payload) 
        }
    })
}))(ActionChain)

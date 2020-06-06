import React, {Component} from "react";
import connect from '../../api-connector';
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import { Grid } from 'semantic-ui-react';

import {withRouter} from 'react-router-dom';
import queryString from 'query-string';

import ActionChain from './ActionChain';
import ActionViewer from './ActionViewer';
import SourceViewer from './SourceViewer'

  
class SampleViewer extends Component {
// TODO: visible state and setVisible
    constructor(props) {
        super(props);
        window.addEventListener("message", this.receiveMessage, false);
        this.state = {
            actionChainName: props.actionChainName,
            selectorTriggered: false,
            startUrl: undefined,
            currentAction: {},
            currentActionErrorReport: {},
            currentPosition: 0,
            // for refresh of iframe
            random: 0
        };

    }

    componentWillReceiveProps(props)
    {
        window.addEventListener("message", this.receiveMessage, false);
        if (!this.state.loaded && props.actionChainParams.fulfilled)
        {
            this.setState({
                loaded: true,
                startUrl: props.actionChainParams.value.startUrl,
                actionChainName: props.actionChainParams.value.name,
                isRepeating: props.actionChainParams.value.isRepeating,
                actions: props.actionChainParams.value.actions,
                selectorTriggered: false,
            });
        }
    }

    receiveMessage = (event) => 
    {
        console.log('updating prediction')
        if (event.data.predicted === undefined || event.data.predicted === '')
        {
            console.log('no prediction');
        }
        else
        {
            // TODO Run chain update here
            console.log(`precited value is ${event.data.predicted}`);
            this.setState((prevState, props) => {
                for (var key in prevState.currentAction)
                {
                    prevState.currentAction[key] = event.data.predicted;
                    // TODO this prints to log
                    console.log(`updating ${key} with ${event.data.predicted}`)
                }
                return {currentAction: prevState.currentAction, selectorTriggered: true}
            });
        }
    }

    reloadSource = () => {
        this.setState({random: this.state.random + 1});
    }

    onActionChainChange = ({e}, value) =>
    {
        this.setState( {selected: true, actionChainName: value} );
    }

    onActionFocus = (actionParams, position, errorReport) => {
        this.setState(prevState => ({
            currentAction: actionParams,
            currentPosition: position,
            currentActionErrorReport: errorReport
        }));
    } 

    onUpdateName = (value) =>
    {
        this.setState({actionChainName: value});
    }

    onUpdateStartUrl = (value) =>
    {
        this.setState({startUrl: value});
    }

    onToolbarValChange = (val, key) =>
    {
        this.setState(prevState => {
            prevState[key] = val;
            return prevState;
        });
    }

    onUpdateAction = (updatedAction) =>
    {
        // TODO: replace the item in the list position
        this.setState(prevState => {
            prevState.actions[prevState.currentPosition] = updatedAction;
            return prevState;
        });
    }

    onPositionChange = (newIndex) =>
    {
        this.setState({currentPosition: newIndex});
    }
  
    render() 
    {
        const {actionChainParams} = this.props;
        if (actionChainParams.pending) {
            return <ReactLoading/>;
        } else if (actionChainParams.rejected) {
            return <div>Error</div>;
        } else if (actionChainParams.fulfilled) { 
            return (
                <Grid width="200%">
                    <Grid.Row width={11}>
                        <ActionViewer
                            selectorTriggered={this.state.selectorTriggered}
                            selectorPrediction={this.state.prediction}
                            currentActionErrorReport={this.state.currentActionErrorReport}
                            selectionChanged={this.state.selectionChanged}
                            actionParameters={this.state.currentAction}
                            onUpdateAction={this.onUpdateAction}
                            position={this.state.currentAction.position}
                        />
                    </Grid.Row>
                    <Grid.Row width={17}>
                        <Grid.Column width={3}>
                            <ActionChain
                                onUpdateName={this.onUpdateName}
                                onUpdateStartUrl={this.onUpdateStartUrl}
                                onToolbarValChange={this.onToolbarValChange}
                                reloadSource={this.reloadSource}
                                onPositionChange={this.onPositionChange}
                                onActionFocus={this.onActionFocus} 
                                actionChainName={this.props.actionChainName} 
                                startUrl={this.state.startUrl}
                                isRepeating={this.state.isRepeating}
                                actions={this.state.actions}
                                selected={this.state.selected}
                            />
                        </Grid.Column> 
                        <Grid.Column width={13}>
                            <SourceViewer
                                position={this.state.currentPosition}
                                random={this.state.random}
                                actionChainName={this.props.actionChainName}
                                srcUrl={this.state.startUrl}
                            />
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
             );
         }
    }
}


export default connect(props => ({
    actionChainParams: {
         url: `/feedmanager/getActionChain/${props.actionChainName}`
    }

}))(withRouter(SampleViewer))

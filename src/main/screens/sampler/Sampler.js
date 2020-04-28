import React, {Component} from "react";
import connect from '../../../api-connector';
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import { Grid, Button } from 'semantic-ui-react';

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
            currentAction: {},
            currentPosition: 0
        };

    }

    componentWillReceiveProps(props)
    {
        console.log(`actionChainParams: ${props.actionChainParams.fulfilled}`);
        window.addEventListener("message", this.receiveMessage, false);
        if (props.actionChainParams.fulfilled)
        {
            this.setState({
                startUrl: props.actionChainParams.value.startUrl,
                name: props.actionChainParams.value.name,
                isRepeating: props.actionChainParams.value.isRepeating,
                actions: props.actionChainParams.value.actions
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
                return {currentAction: prevState.currentAction}
            });
        }
    }

    onActionChainChange = ({e}, value) =>
    {
        this.setState( {selected: true, actionChainName: value} );
    }

    onActionFocus = (actionParams, position) => {
        this.setState((prevState, props) => {
            return {currentAction: actionParams, currentPosition: position};
        });
    }

    onUpdateName = (value) =>
    {
        this.setState({name: value});
    }

    onUpdateStartUrl = (value) =>
    {
        this.setState({startUrl: value});
    }

    onUpdateAction = (updatedAction) =>
    {
        // TODO: replace the item in the list position
        this.setState(prevState => {
            prevState.actions[prevState.currentPosition] = updatedAction;
            return prevState;
        });
    }
 
    render() 
    {
        const {actionChainParams} = this.props;
        if (actionChainParams.pending) {
            return <ReactLoading/>
        } else if (actionChainParams.rejected) {
            return <div>Error</div>
        } else if (actionChainParams.fulfilled) {
            return (
                <Grid width="200%">
                    <Grid.Row columns={1} height={8}>
                        <Button onClick={ () => this.props.reloadSampleUrl() }>RefreshSample</Button>
                    </Grid.Row>
                    <Grid.Row columns={1} height={13} >
                        <Grid.Column width={4}>
                            <ActionChain
                                onUpdateName={this.onUpdateName}
                                onUpdateStartUrl={this.onUpdateStartUrl}
                                onActionFocus={this.onActionFocus} 
                                name={this.state.name} 
                                startUrl={this.state.startUrl}
                                actions={this.state.actions}
                                selected={this.state.selected}
                            />
                        <ActionViewer
                            selectorPrediction={this.state.prediction}
                            actionParameters={this.state.currentAction}
                            onUpdateAction={this.onUpdateAction}
                            position={this.state.currentAction.position}
                        />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {/** TODO: here should render iframe as a seperate refreshing component 
                             * given the startUrl. Should also have a next and back arrow for 
                             * going to the next action.
                             */}
                            <SourceViewer
                                position={this.state.currentPosition}
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
         url: `actionsmanager/getActionChain/${props.actionChainName}`
    },
    reloadSampleUrl : () => ({
        reloadSample: {
        url: `/samplepages/requestSamplePages/${props.actionChainName}`
    }
})
}))(SampleViewer)

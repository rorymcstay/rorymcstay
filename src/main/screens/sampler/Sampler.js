import React, {Component} from "react";
import connect from '../../../api-connector';
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Grid, Button } from 'semantic-ui-react';

import ActionChain from './ActionChain';
import ActionViewer from './ActionViewer';

  
class SampleViewer extends Component {
// TODO: visible state and setVisible
    constructor(props) {
        super(props);
        window.addEventListener("message", this.receiveMessage, false);
        this.state = {
            actionChainName: props.actionChainName,
            currentAction: {}
        };

    }

    componentWillReceiveProps(props)
    {
        console.log(`actionChainParams: ${props.actionChainParams.fulfilled}`);
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

    onSetVisible = () => {
        this.setState({visible: true});
    }
    
    receiveMessage = (event) => 
    {
        console.log('updating prediction')
        if (event.data.predicted == undefined || event.data.predicted == '')
        {
    
        }
        else
        {
            // TODO Run chain update here
        }
    }

    latestCapture = () =>
    {
        return this.state.captures[this.state.captures.length - 1];
    }

    onActionChainChange = ({e}, value) =>
    {
        this.setState( {selected: true, actionChainName: value} );
    }

    onActionFocus = (actionParams) => {
        this.setState((prevState, props) => {
            return {currentAction: actionParams};
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

    onUpdateAction = (updatedAction, pos) =>
    {
        // TODO: replace the item in the list position
        this.setState((prevState, props) =>{
            prevState.actions[pos] = updatedAction;
            return {action: prevState.actions}
        });
    }
 
    onDeleteAction = (updatedAction) =>
    {
        // TODO: replace the item in the list position
        this.setState();
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
                <Grid width="150%">
                    <Grid.Row columns={1}height={2}>
                        <Button onClick={ () => this.props.reloadSampleUrl() }>RefreshSample</Button>
                    </Grid.Row>
                    <Grid.Row columns={1} height={13}>
                        <Grid.Column width={2}>
                            <ActionChain
                                onUpdateName={this.onUpdateName}
                                onUpdateStartUrl={this.onUpdateStartUrl}
                                onActionFocus={this.onActionFocus} 
                                name={this.state.name} 
                                startUrl={this.state.startUrl}
                                actions={this.state.actions}
                                selected={this.state.selected}
                            />
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Iframe
                                width="100%"
                                height="800px"
                                url={`/feedjobmanager/getSamplePage/${this.props.feedName}`}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row width={13}>
                        <ActionViewer
                            actionParameters={this.state.currentAction}
                            updateAction={this.onUpdateAction}
                        />
                    </Grid.Row>
                </Grid>
             );
         }
    }
}


export default connect(props => ({
    sampleUrl: {
        url: `/sampler/getSampleUrl/${props.feedName}`
    },
    captureValues: {
        url: `/feedmanager/getCaptures/list/${props.feedName}`
    },
    uploadCaptures: (payload) => ({
        uploadCaptureResposne: {
            url: `/feedmanager/uploadCaptures/${props.feedName}`,
            body: JSON.stringify(payload),
            method: 'PUT'
        }
    }),
    actionChainParams: {
         url: `actionsmanager/getActionChain/${props.actionChainName}`
    },
    reloadSampleUrl : () => ({
        reloadSample: {
        url: `/feedjobmanager/requestSamplePage/${props.feedName}`
    }
})
}))(SampleViewer)

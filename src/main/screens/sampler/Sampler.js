import React, {Component} from "react";
import Form from "react-jsonschema-form";
import connect from '../../../api-connector';
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';
import {Dropdown} from "semantic-ui-react";

import { Header, Icon, Image, Menu, Input, Segment, Sidebar } from 'semantic-ui-react';

import ActionChain from './ActionChain';


class CaptureOptions extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectorPrediction: undefined,
            selectorUsage: undefined,
            captureName: undefined 
        }
    }

    render (){

        return (
            <div>
                <Input placeholder='Css selector or Xpath' value={this.state.selectorPrediction}/>
                <Input placeholder='component and name' value={this.state.selectorUsage}/>
                <Input placeholder='name' value={this.state.captureName}/>
                <Button>Save</Button>
            </div>
        );
    }
}
  
class SampleViewer extends Component {
// TODO: visible state and setVisible
    constructor(props) {
        super(props);
        window.addEventListener("message", this.receiveMessage, false);
        this.state = {
            actionChainName: undefined
        };

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
        this.setState( {selected: true, actionName: value} );
    }

    onNewAction = () => {
        this.props.newActionSchema();
        this.setState((prevState, props) => ({newAction: true}));
    }

    onSubmit = ({formData}, e) => {
        const payload = {
            feed: this.props.tableName,
            captures: this.state.captures
        };
        this.props.uploadCaptures(payload);
    };


    render() 
    {
        const {actionChains, sampleUrl} = this.props;
        if (sampleUrl.pending) {
            return <ReactLoading/>
        } else if (sampleUrl.rejected) {
            return <div>Error</div>
        } else if (sampleUrl.fulfilled) { 
            return (
                <Grid width="150%">
                    <Grid.Row columns={1}height={2}>
                        <Button onClick={ () => this.props.reloadSampleUrl() }>RefreshSample</Button>
                        <Dropdown
                            placeholder='Select ActionChain'
                            fluid
                            search
                            selection
                            onChange={this.onActionChainChange}
                            options={actionChains.value}
                        />;

                    </Grid.Row>
                    <Grid.Row columns={1} height={13}>
                        <Grid.Column width={2}>
                            <ActionChain actionChainName={this.state.actionName} selected={this.state.selected}/>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Iframe
                                width="100%"
                                height="800px"
                                url={`/feedjobmanager/getSamplePage/${this.props.feedName}`}
                            />
                        </Grid.Column>
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
        actionChains: {
            url: `/actionsmanager/getActionChains/`
        },
        reloadSampleUrl : () => ({
            reloadSample: {
            url: `/feedjobmanager/requestSamplePage/${props.feedName}`
        }
    })
}))(SampleViewer)

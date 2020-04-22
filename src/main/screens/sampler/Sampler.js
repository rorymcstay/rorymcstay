import React, {Component} from "react";
import Form from "react-jsonschema-form";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';
import { Grid, Button, ButtonGroup } from 'semantic-ui-react';

import { Header, Icon, Image, Menu, Input, Segment, Sidebar } from 'semantic-ui-react';

class Capture extends Component
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

    render ()
    {
        <Label onClick>{this.selectorUsage}</Label>
    }
}

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
        const {captureValues} = props;
        var capturesVal = [];
        if (captureValues.pending) {
            capturesVal = [{captureName: '', capture: ''}];
        } else if (captureValues.rejected) {
            capturesVal = [{captureName: '', capture: ''}];
        } else if (captureValues.fulfilled) {
            capturesVal = captureValues.value;
        }
        this.state = {
            captureCssValue: '',
            captureXpathVale: '',
            captures: capturesVal
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
            this.setState((prevState, props) => {
                console.log('from react app: '+ event.data.predicted);
                const key = 'capture' + prevState.captures.length;
                prevState.captures.push({'captureName': key, 'capture': event.data.predicted});
                return {captures: prevState.captures};
            });
        }
    }

    latestCapture = () =>
    {
        return this.state.captures[this.state.captures.length - 1];
    }

    onSubmit = ({formData}, e) => {
        const payload = {
            feed: this.props.tableName,
            captures: this.state.captures
        };
        this.props.uploadCaptures(payload);
    };

    renderCaptures = () =>
    {

        const {captures} = this.state;
        const captureSchema = {
            type: "array",
            title: "Mapping",
            items: {
                type: "object",
                properties: {
                    captureName: {
                        type: "string",
                    },
                    capture: {
                        type: "string",
                    }
                }
            }
        };
        // TODO Mapping should be
        return ;
        
    }


    render() {
        const {sampleUrl} = this.props;
        if (sampleUrl.pending) {
            return <ReactLoading/>
        } else if (sampleUrl.rejected) {
            return <div>Error</div>
        } else if (sampleUrl.fulfilled) {
            
            return (
                <Grid columns={1}>
                    <Grid.Row height={2}>
                        <Button onClick={ () => this.props.reloadSampleUrl()}>RefreshSample</Button>

                    </Grid.Row>
                    {this.renderCaptures()}
                    <Grid.Row height={13}>
                        <Sidebar.Pushable as={Segment}>
                            <Sidebar
                            as={CaptureOptions}
                            animation='overlay'
                            direction='right'
                            inverted
                            vertical
                            visible={this.state.visible}
                            >

                            <CaptureOptions />
                            </Sidebar>
                    
                            <Sidebar.Pusher>
                            <Segment basic>
                                <Header as='h3'>Application Content</Header>
                                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                            </Segment>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                        <Iframe
                            width="100%"
                                height="800px"
                                url={`/feedjobmanager/getSamplePage/${this.props.feedName}`}
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
        reloadSampleUrl : () => ({
            reloadSample: {
            url: `/feedjobmanager/requestSamplePage/${props.feedName}`
        }
    })
}))(SampleViewer)

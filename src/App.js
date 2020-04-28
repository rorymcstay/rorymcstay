/* global chrome */
import React, {Component} from 'react';
import './App.css';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Selector from "./main/Selector";
import ParameterManager from "./main/screens/parameters/ParameterManager";
import Viewer from "./main/screens/viewer/Viewer";
import 'semantic-ui-css/semantic.min.css'
import Scheduler from "./main/screens/scheduler/Scheduler"
import ToolBar from "./main/toolbar/ToolBar";
import {Grid, Container} from "semantic-ui-react";
import Mapping from "./main/screens/mapping/Mapping";
import SamplerViewer from "./main/screens/sampler/Sampler"


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actionChainName: undefined,
            parameterType: "leader",
            tableName: undefined,
            domain: undefined
        }
    }


    onNewFeed = (value) => {
        this.setState({actionChainName: 'NewActionChain'})
    };

    onParameterChange = (value) => {
        this.setState({parameterType: value})
    };

    onTableChange = (value) => {
        this.setState( { tableName: value})
    };

    onActionChainChange = (value) => {
        this.setState( { actionChainName: value, actionChainName: value} );
    }

    render() {
        return (
            <Container className="App">
                <Grid columns='equal'>
                    <Grid.Row centered={false}>
                        <Grid.Column>
                            <Selector
                                onFeedChange={this.onFeedChange}
                                onActionChainChange={this.onActionChainChange}
                                onNewFeed={this.onNewFeed}
                                actionChainName={this.state.actionChainName}
                                actionChainName={this.state.actionChainName}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <ToolBar actionChainName={this.state.actionChainName}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={this.state.key}
                                onSelect={key => this.setState({key})}
                            >
                                <Tab eventKey="viewer" title="Viewer">
                                    <Viewer 
                                        actionChainName={this.state.actionChainName} 
                                        updateTableName={this.onTableChange}
                                    />
                                </Tab>
                                <Tab eventKey="parametermanager" title="Parameter Manager">
                                    <ParameterManager 
                                        actionChainName={this.state.actionChainName} 
                                        parameterType={this.state.parameterType} 
                                        onParameterChange={this.onParameterChange}
                                    />
                                </Tab>
                                <Tab eventKey="scheduler" title="Scheduler">
                                    <Scheduler 
                                        actionChainName={this.state.actionChainName}
                                    />
                                </Tab>
                                {/*
                                <Tab eventKey="mapping" title="Mapping">
                                    <Mapping 
                                        actionChainName={this.state.actionChainName} 
                                        tableName={this.state.tableName}
                                />
                                </Tab>
                                */}
                                <Tab eventKey="sampling" title="Sampling">
                                    <SamplerViewer 
                                        actionChainName={this.state.actionChainName} 
                                        actionChainName={this.state.actionChainName}
                                    />
                                </Tab>
                                </Tabs>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default App;

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
            feedName: undefined,
            parameterType: "leader",
            tableName: undefined
        }
    }

    onFeedChange = value => {
        this.setState({feedName: value})
    };


    onNewFeed = (value) => {
        this.setState({feedName: value})
    };

    onParameterChange = (value) => {
        this.setState({parameterType: value})
    };

    onTableChange = (value) => {
        this.setState( { tableName: value})
    };

    render() {
        return (
            <Container className="App">
                <Grid columns='equal'>
                    <Grid.Row centered={false}>
                        <Grid.Column>
                            <Selector
                                onFeedChange={this.onFeedChange}
                                onNewFeed={this.onNewFeed}
                                feedName={this.state.feedName}
                            />
                        </Grid.Column>
                        <Grid.Column>

                            <ToolBar feedName={this.state.feedName}/>
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
                                    <Viewer feedName={this.state.feedName} updateTableName={this.onTableChange}/>
                                </Tab>
                                <Tab eventKey="parametermanager" title="Parameter Manager">
                                    <ParameterManager feedName={this.state.feedName} parameterType={this.state.parameterType} onParameterChange={this.onParameterChange}/>
                                </Tab>
                                <Tab eventKey="scheduler" title="Scheduler">
                                    <Scheduler feedName={this.state.feedName}/>
                                </Tab>
                                <Tab eventKey="mapping" title="Mapping">
                                    <Mapping feedName={this.state.feedName} tableName={this.state.tableName}/>
                                </Tab>
                                <Tab eventKey="sampling" title="Sampling">
                                    <SamplerViewer feedName={this.state.feedName} />
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

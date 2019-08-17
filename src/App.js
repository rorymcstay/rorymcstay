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
import {Grid} from "semantic-ui-react";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedName: undefined
        }
    }

    onFeedChange = value => {
        this.setState({feedName: value})
    };

    onNewFeed = (value) => {
        this.setState({feedName: value})
    };

    render() {

        return (
            <div className="App">
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={8}>
                            <Selector
                                onFeedChange={this.onFeedChange}
                                onNewFeed={this.onNewFeed}
                                feedName={this.state.feedName}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <ToolBar feedName={this.state.feedName}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={this.state.key}
                                onSelect={key => this.setState({key})}
                            >
                                <Tab eventKey="viewer" title="Viewer">
                                    <Viewer feedName={this.state.feedName}/>
                                </Tab>
                                <Tab eventKey="parametermanager" title="Parameter Manager">
                                    <ParameterManager feedName={this.state.feedName}/>
                                </Tab>
                                <Tab eventKey="scheduler" title="Scheduler">
                                    <Scheduler feedName={this.state.feedName}/>
                                </Tab>
                            </Tabs>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default App;

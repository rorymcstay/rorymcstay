import React, {Component} from 'react';
import './App.css';
import {withAlert} from 'react-alert';
import 'semantic-ui-css/semantic.min.css'

// layout
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {Grid, Container} from "semantic-ui-react";

// routing 
import { Route, Switch, Redirect, Link, withRouter } from "react-router-dom";
// https://github.com/chacestew/react-router-tabs
import { RoutedTabs, NavTab } from "react-router-tabs";
import "react-router-tabs/styles/react-router-tabs.css";
import queryString from 'query-string';

// Navigation
import Selector from "./main/Selector";
import ToolBar from "./main/toolbar/ToolBar";

// Tabs
import ParameterManager from "./main/screens/parameters/ParameterManager";
import Scheduler from "./main/screens/scheduler/Scheduler"
import Viewer from "./main/screens/viewer/Viewer";
//import Mapping from "./main/screens/mapping/Mapping";
import SamplerViewer from "./main/screens/sampler/Sampler"



class App extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        const params = queryString.parse(props.location.search);
        this.state = {
            actionChainName: params.chain,
            parameterType: "leader",
            tableName: undefined,
            domain: undefined
        }
    }

    onNew = () => {
        this.setState({actionChainName: 'NewActionChain'});
    }

    onParameterChange = (value) => {
        this.setState({parameterType: value});
    }

    onTableChange = (value) => {
        this.setState( { tableName: value});
    }

    onActionChainChange = (value) => {
        this.setState( { actionChainName: value} );
    }

    renderLinkedTabs = () => {

        return (<div> 
            <NavTab to={`/chain-viewer/?chain=${this.state.actionChainName}`}>Chain-Viewer</NavTab>
            <NavTab to={`/capture-viewer/?chain=${this.state.actionChainName}`}>Capture-Viewer</NavTab>
            <NavTab to={`/chain-scheduler/?chain=${this.state.actionChainName}`}>Chain-Scheduler</NavTab>
            <Switch>
                <Route
                  exact
                  path='/'
                  render={() => <Redirect replace to={`/chain-viewer`} />}
                />
                    <Route path={`/chain-viewer`}>
                        <SamplerViewer
                            alert={this.props.alert}
                            actionChainName={this.state.actionChainName}
                        />
                    </Route>
                    <Route path={`/capture-viewer`}>
                        <Viewer 
                            alert={this.props.alert}
                            actionChainName={this.state.actionChainName} 
                            updateTableName={this.onTableChange}
                        />
                    </Route>
                    <Route path={`/chain-scheduler`}>
                        <Scheduler 
                            alert={this.props.alert}
                            actionChainName={this.state.actionChainName}
                        />
                    </Route>
             </Switch>
         </div>);
    }

    render() {
        return (
            <Container className="App">
                <Grid columns='equal'>
                    <Grid.Row centered={false}>
                        <Grid.Column>
                            <Selector
                                onActionChainChange={this.onActionChainChange}
                                onNew={this.onNew}
                                actionChainName={this.state.actionChainName}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <ToolBar actionChainName={this.state.actionChainName}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        {this.renderLinkedTabs()}
                        {/*
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={this.state.key}
                                onSelect={key => this.setState({selectedTab: key})}
                            >
                        */}

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default withAlert()(withRouter(App));

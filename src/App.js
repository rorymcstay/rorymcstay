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

// Toolbar
import Selector from "./toolbar/Selector";
import ToolBar from "./toolbar/RunningManager";
import UserProfile from "./toolbar/UserProfile";

// Tabs/Screens
import ParameterManager from "./screens/parameters/ParameterManager";
import Scheduler from "./screens/scheduler/Scheduler"
import Viewer from "./screens/viewer/Viewer";
//import Mapping from "./main/screens/mapping/Mapping";
import SamplerViewer from "./screens/sampler/Sampler"



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

    /*
     * Seeing if we can remove all other methods apart from renderer
    onTableChange = (value) => {
        this.setState( { tableName: value});
    }
    */

    onActionChainChange = (value) => {
        this.setState( { actionChainName: value} );
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
                            <UserProfile userName={this.props.username} />
                        </Grid.Column>
                        <Grid.Column>
                            <ToolBar actionChainName={this.state.actionChainName}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column> 
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
                                            //updateTableName={this.onTableChange}
                                        />
                                    </Route>
                                    <Route path={`/chain-scheduler`}>
                                        <Scheduler 
                                            alert={this.props.alert}
                                            actionChainName={this.state.actionChainName}
                                        />
                                    </Route>
                             </Switch>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default withAlert()(withRouter(App));

import React, {Component} from 'react';
import './App.css';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Selector from "./main/Selector";
import ParameterManager from "./main/screens/parameters/ParameterManager";
import Viewer from "./main/screens/viewer/Viewer";
import 'semantic-ui-css/semantic.min.css'
import Scheduler from "./main/screens/scheduler/Scheduler"

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

    render() {
        return (
            <div className="App">
                <Selector
                    onFeedChange={this.onFeedChange}
                />
                <Tabs
                    id="controlled-tab-example"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({key})}
                >
                    {/*<Tab eventKey="viewer" title="Viewer">*/}
                    {/*    <Viewer onChange={name => this.onFeedChange(name)}/>*/}
                    {/*</Tab>*/}
                    <Tab eventKey="parametermanager" title="Parameter Manager">
                        <ParameterManager feedName={this.state.feedName}/>
                    </Tab>
                    <Tab eventKey="scheduler" title="Scheduler">
                        <Scheduler feedName={this.state.feedName}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default App;

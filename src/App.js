import React, { Component } from 'react';
import './App.css';
import Toolbar from "./screens/manager/Toolbar";
import FeedStatus from "./screens/manager/FeedStatus";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Toolbar/>
        <FeedStatus

        />
      </div>
    );
  }
}

export default App;

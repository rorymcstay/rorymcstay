import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {transitions, positions, Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'


ReactDOM.render(
    <AlertProvider template={AlertTemplate}>
        <App/>
    </AlertProvider>, document.getElementById('root'));

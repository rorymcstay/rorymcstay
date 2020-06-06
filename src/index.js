import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {transitions, positions, Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import withAuthentication from './auth/AuthWrapper'

import { BrowserRouter } from "react-router-dom";

//const AuthWrappedApp = AuthWrapper(App);
require('dotenv').config()

const AuthenticatedApp = withAuthentication(App);

ReactDOM.render(
    <AlertProvider template={AlertTemplate}>
        <BrowserRouter>
           <App/> 
        </BrowserRouter>
    </AlertProvider>
    , document.getElementById('root'));


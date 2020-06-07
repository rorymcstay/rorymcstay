import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import withAuthentication from './auth/AuthWrapper'

import { BrowserRouter } from "react-router-dom";

//const AuthWrappedApp = AuthWrapper(App);
require('dotenv').config()


ReactDOM.render(
        <BrowserRouter>
           <App/> 
        </BrowserRouter>
    , document.getElementById('root'));


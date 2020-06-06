import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {transitions, positions, Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import AuthWrapper from './auth/AuthWrapper'

import { BrowserRouter } from "react-router-dom";

//const AuthWrappedApp = AuthWrapper(App);
require('dotenv').config()

ReactDOM.render(
    <BrowserRouter>
       <AlertProvider template={AlertTemplate}>
              <AuthWrapper>
            <App/>
          </AuthWrapper>
        </AlertProvider>
    </BrowserRouter>
    , document.getElementById('root'));


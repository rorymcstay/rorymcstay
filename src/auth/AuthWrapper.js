import React, {Component} from 'react';
// Auth
import connect from '../api-connector';
import ReactLoading from 'react-loading';
import {InputGroup, FormControl,  Button} from 'react-bootstrap';

import Login from './Login'; 

var KeratinAuthN = require("keratin-authn");


class LoginScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            password: undefined,
            username: undefined
        }
    }
    
    onUsernameChange = (e) =>
    {
        this.setState({username: e.target.value});
    }

    onPasswordChange = (e) =>
    {
        this.setState({username: e.target.value});
    }

    onLogin = () =>
    {
        const credentials = {username: this.state.username, password: this.state.password};
        this.props.onLogin(credentials);
    }

    render()
    {
        return (
            <InputGroup>
                <InputGroup.Prepend>
                    <FormControl placeholder='Username' onChange={this.onUsernameChange} type='email'/>
                    <FormControl placeholder='Password' onChange={this.onPasswordChange} type="password"/>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                    <Button onClick={this.onLogin}>Login</Button>
                    <Button onRegister={this.onRegister}>Register</Button>
                </InputGroup.Prepend>

            </InputGroup>
        );
    }
}


// TODO if cookies have a user, get there session token and test it.
// if ok, then render app
// otherwise, direct to login page
class AuthWrapper extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: props.user,
            sessiontoken: props.sessiontoken
        }
        KeratinAuthN.setHost('localhost:8080');
        KeratinAuthN.setCookieStore('feed-machine');
        KeratinAuthN.restoreSession().then(this.setState({loggedIn: true, username: ''})).catch(this.setState({loggedIn: false}));
    }

    onLogin = (credentials) =>
    {
        const loginReq = KeratinAuthN.login(credentials).then(this.setState({loggedIn: true, user: credentials.user}));;
        
    }

    onLogout = (credentials) =>
    {
        const logoutReq = KeratinAuthN.logout();
    }

    onRegister = (credentials) =>
    {
        const register = KeratinAuthN.signup(credentials);
    }

    render() {
        // TODO if authorsed load component else load login page.
        // TODO overlay the authorised component with a user toolbar.
       
        var isVerified;
        
        /*
        if (isVerified)
        {
            return <ReactLoading/>;
        }
        */
        if ( !this.state.loggedIn)
        {
            return <Login/>
        }
        // TODO add logout button here
        return <>{this.children}</>; 
    }
}

// Intentionally defined here so we can load children depending on the sate of there request
export default AuthWrapper;
/*
ReactDOM.render(<Auth user={user}/>, document.getElementById('root'));
*/

/*jshint esversion: 6 */

import React, { Component } from 'react';
import {AUTH_URL, AUTH_ENABLED, OAUTH_ENABLED, HOME_URL} from '../auth-config';

import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import {Grid} from 'semantic-ui-react';
import {InputGroup, Button} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';

import {withAlert} from 'react-alert';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SignUp from './SignUp.js';
import ErrorMessage from './ErrorMessage'


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
        this.setState({password: e.target.value});
    }
    onLogin = () =>
    {
        const self = this;
        KeratinAuthN.login({ username: this.state.username, password: this.state.password })
          .then(function (val) {
            console.log("login success");
            self.props.onLoginSuccess();
          }).catch(function (reason) {
            console.log("failed login", reason);
            self.showError(reason);
          });
    }

    onSignUp = () =>
    {
        const self = this;
        KeratinAuthN.signup({ username: this.state.username, password: this.state.password })
          .then(function (val) {
            console.log(`signup success ${val} for ${self.state.username}`);
            self.props.onSignUpSuccess(self.state.username);
          }).catch(function (reason) {
            console.log("failed signup", reason[0]);
            self.showError(reason);
          });
    }

    showError(reason) {
        let errorMessage;
        switch (reason[0].message) {
            case 'TAKEN':
                errorMessage = "UserName is taken"
            break;
            case 'INSECURE':
                errorMessage = "Please use a secure password at least 10 characters in length and containing at least 2 symbols";
            break;
            default:
                errorMessage = "Invalid username or password";
        }
        this.setState({ showError: true, errorMessage: errorMessage });
    }

    render()
    {
        const showError = this.state.showError;
        let error;
        if (showError) {
            error = <ErrorMessage errorMessage={this.state.errorMessage} />
        }
        return (
            <Grid>
                <Grid.Row>
                    {error}
                </Grid.Row>
                <Grid.Row>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <FormControl placeholder='Username' onChange={this.onUsernameChange} type='email'/>
                            <FormControl placeholder='Password' onChange={this.onPasswordChange} type="password"/>
                        </InputGroup.Prepend>
                        <InputGroup.Prepend>
                            <Button onClick={this.onLogin}>Login</Button>
                            <Button onClick={this.onSignUp}>Register</Button>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Grid.Row>
            </Grid>
        );
    }
}

class AuthWrapper extends Component {
    constructor(props) {
        super(props);

        var event = "ShowHome";
        if (!AUTH_ENABLED) {
            this.loggedIn = true;
        }

        this.state = {
            event: event,
            loggedIn: false,
            oAuthURI: AUTH_URL + "/oauth/github?redirect_uri=" + HOME_URL,
            oAuthEnabled: OAUTH_ENABLED,
        };

        console.log("auth:", '/');

        KeratinAuthN.setHost(AUTH_URL);
        KeratinAuthN.setCookieStore("authn",{path: "/", SameSite: "Lax"} );
        //KeratinAuthN.setLocalStorageStore("authn");
    }

    onLoginSuccess = () =>
    {
        this.setState({loggedIn: true});
    }

    logout = () =>
    {
        KeratinAuthN.logout();
    }
  
    onSignUpSuccess = () =>
    {
        this.setState({loggedIn: true});
    }
    onLoginFailure = (reason) =>
    {
        this.setState({loggedIn: false});
    }
    onSignUpFailure = (reason) =>
    {
        this.setState({loggedIn: false});
    }

    componentDidMount() {
        const self = this;
        KeratinAuthN.importSession().then(() => {
            console.log("restoring session");
            self.setState({ loggedIn: true });
        }).catch(error => {
            console.log("error restoring session: ", error);
        });
    }

    render() {
        var eventElement = null;

        if (!this.state.loggedIn)
        {
            console.log("show login");
            return (<LoginScreen oAuthEnabled={this.state.oAuthEnabled} 
                                 oAuthURI={this.state.oAuthURI}
                                 onLoginFailure={this.onLoginFailure}
                                alert={this.props.alert}
                                 onLoginSuccess={this.onLoginSuccess}
                                 onSignUpFailure={this.onSignUpFailure}
                                 onSignUpSuccess={this.onSignUpSuccess}
                            />);
        }
        else
        {
            console.log("logged in");
            // TODO need to put logout button
            return <Grid><Grid.Row><Button onClick={this.logout()}>LogOut</Button></Grid.Row><Grid.Row><>{this.props.children}</></Grid.Row></Grid>;
        }

        return (
                eventElement
        );
  }
}

export default withAlert()(AuthWrapper);

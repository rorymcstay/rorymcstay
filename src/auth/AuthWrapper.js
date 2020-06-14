/*jshint esversion: 6 */

import React, { Component } from 'react';
import {AUTH_URL, AUTH_ENABLED, OAUTH_ENABLED, HOME_URL} from '../auth-config';

import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import {Grid} from 'semantic-ui-react';
import {InputGroup, Button} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SignUp from './SignUp.js';
import ErrorMessage from './ErrorMessage'


class LoginScreen extends Component
{
    // TODO Need to add a toggle for registering or logging in.
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
        // TODO add password strength metre
        this.setState({password: e.target.value});
    }
    onLogin = () =>
    {
        const self = this;
        KeratinAuthN.login({ username: this.state.username, password: this.state.password })
          .then(function (val) {
            console.log(`login success for ${self.state.username}`);
            self.props.storeUserDetails(self.state.username);
            self.props.onLoginSuccess();
          }).catch(reason =>  {
            console.log("failed login", reason);
            self.showError(reason);
          });
    }

    onSignUp = () =>
    {
        const self = this;
        KeratinAuthN.signup({ username: this.state.username, password: this.state.password })
          .then(val => {
            console.log(`signup success ${val} for ${self.state.username}`);
            self.props.storeUserDetails(self.state.username);
            self.props.onSignUpSuccess();
          })
          .catch((reason) => {
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
                errorMessage = "Password failed the strength test, try again";
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

const withAuthentication = (WrappedComponent) =>{

    return class extends React.Component 
    {
        constructor(props) {
            super(props);

            if (!AUTH_ENABLED) {
                this.state = {loggedIn: true};
            }

            this.state = {
                loggedIn: false,
            };

            console.log("auth:", AUTH_URL);

            KeratinAuthN.setHost(AUTH_URL);
            KeratinAuthN.setCookieStore("authn",{path: "/", SameSite: "Strict"} );
        }
     
        storeUserDetails = (username) =>
        {
            console.log(`Storing username=[${username}]`);
            localStorage.setItem('username', username);
        }
        onLoginSuccess = () =>
        {
            this.setState({loggedIn: true});
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
            KeratinAuthN.importSession().then(function(resp) {
                console.log(`restoring session KeratinAuthN=[${KeratinAuthN.session()}]`);
                self.setState({ loggedIn: true });
            }).catch(error => {
                console.log("error restoring session: ", error);
            });
        }

        render() {
            if (!this.state.loggedIn)
            {
                console.log("show login screen");
                return (<LoginScreen onLoginFailure={this.onLoginFailure}
                                     alert={this.props.alert}
                                     storeUserDetails={this.storeUserDetails}
                                     onLoginSuccess={this.onLoginSuccess}
                                     onSignUpFailure={this.onSignUpFailure}
                                     onSignUpSuccess={this.onSignUpSuccess}
                                />);
            }
            else
            {
                console.log("logged in");
                return <WrappedComponent alert={alert} {...this.props}/>;
            }
        }
    }
}
export default withAuthentication;

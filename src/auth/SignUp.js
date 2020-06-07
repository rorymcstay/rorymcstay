/*jshint esversion: 6 */
import React, { Component } from 'react';

import './Login.css';

import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import ErrorMessage from './ErrorMessage';
import LoginForm from './LoginForm';
import PasswordStrength from './PasswordStrength';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.state = {
      showError: false,
      errorMessage: ""
    };
  }

  handleSignUp(e) {
    const self = this
    KeratinAuthN.signup({ username: this.state.username, password: this.state.password })
      .then(function (val) {
        console.log("signup success");
        self.signUpSuccess();
      }).catch(function (reason) {
        console.log("failed signup", reason);
        self.showError(reason);
      });
  }

  handleLoginClick() {
    this.setState({ showError: false });
    this.props.onResult("ShowLogin");
  }

  signUpSuccess() {
    this.setState({ showError: false });
    this.props.onResult("SignUpSuccess");
  }

  showError(reason) {
    let errorMessage;
    switch (reason[0].message) {
      case 'TAKEN':
        errorMessage = <div>Sorry this username is already taken, click here to <a onClick={this.handleLoginClick}>Log in</a></div>
        break;
      case 'INSECURE':
        errorMessage = "Please use a secure password at least 10 characters in length and containing at least 2 symbols";
        break;
      default:
        errorMessage = "An unexpected error has occurred";
    }

    this.setState({ showError: true, errorMessage: errorMessage });
  }

  handleUsernameChange(value) {
    this.setState({ username: value });
  }

  handlePasswordChange(value) {
    this.setState({ password: value });
  }

  render() {
    const showError = this.state.showError;
    let error;

    if (showError) {
      error = <ErrorMessage errorMessage={this.state.errorMessage} />
    }

    return (
      <Container>
        <Row>
          <Col md={12}>
            {error}
          </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={3}>
            <Card className="loginCard">
              <Card.Heading>
                <Card.Title><h3>Signup</h3></Card.Title>
                <h4>Sign up for a new account to start emojifying</h4>
              </Card.Heading>
              <Card.Body>
                <form>
                  <LoginForm onUsernameChange={this.handleUsernameChange} onPasswordChange={this.handlePasswordChange} />
                  <PasswordStrength password={this.state.password} />
                  <br />
                  <Button block bsSize="large" bsStyle="primary" onClick={this.handleSignUp}>Signup</Button>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUp;

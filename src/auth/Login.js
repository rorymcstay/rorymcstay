/*jshint esversion: 6 */
import React, { Component } from 'react';
import './Login.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ErrorMessage from './ErrorMessage'; 
import LoginForm from './LoginForm';
var KeratinAuthN = require("keratin-authn");

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);

    this.state = {
      showError: false,
      errorMessage: ""
    };
  }

  handleLogin(e) {
    const self = this;
    KeratinAuthN.login({ username: this.state.username, password: this.state.password })
      .then(function (val) {
        console.log("signup success");
        self.signUpSuccess();
      }).catch(function (reason) {
        console.log("failed signup", reason);
        self.showError(reason);
      });
  }

  signUpSuccess() {
    this.setState({ showError: false });
    this.props.onResult("LoginSuccess");
  }

  showError(reason) {
    console.log(reason);
    let errorMessage;
    switch (reason[0].message) {
      case "FAILED":
        errorMessage = <div>Incorrect username or password, to sign up please click here: <a onClick={this.handleSignUpClick}>Sign up</a></div>
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

  handleSignUpClick() {
    this.props.onResult("ShowSignUp");
  }

  render() {
    let error;
    if (this.state.showError) {
      error = <ErrorMessage errorMessage={this.state.errorMessage} />
    }

    let authButton;
    if (this.props.oAuthEnabled) {
      authButton = <Button href={this.props.oAuthURI} block bsSize="large" bsStyle="primary">Login with Github</Button>
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
            <Card className="loginPanel">
              <Card.Heading>
                <Card.Title><h3>Login</h3></Card.Title>
                <h4>Login to Emojify using your email address and password</h4>
              </Card.Heading>
              <Card.Body>
                  <LoginForm onUsernameChange={this.handleUsernameChange} onPasswordChange={this.handlePasswordChange} />
                  <Row>
                    <Col md={12}>
                      <Button block bsSize="large" bsStyle="success" onClick={this.handleLogin}>Login</Button>
                    </Col>
                  </Row>
                  <Row><Col md={12}>&nbsp;</Col></Row>
                  <Row>
                    <Col md={12}>
                      <Button block bsSize="large" bsStyle="danger" onClick={this.handleSignUpClick}>SignUp</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col md={12} >
                      {authButton}
                    </Col>
                  </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row >
      </Container>
    );
  }
}

export default Login;

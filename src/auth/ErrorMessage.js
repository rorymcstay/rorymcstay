/*jshint esversion: 6 */
import React, { Component } from 'react';

import Alert from 'react-bootstrap/Alert';

class ErrorMessage extends Component {
  render() {
    return (
      <Alert bsstyle="danger">
        <h3> {this.props.errorMessage}</h3>
      </Alert>
    );
  }
}

export default ErrorMessage;

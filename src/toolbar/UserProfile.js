import React, {Component} from 'react';
import connect from "../api-connector";
import Button from "react-bootstrap/Button";
import {ButtonGroup, ButtonToolbar} from "react-bootstrap";
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

class UserProfile extends Component {

    constructor(props) {
        super(props);
    }

    logout = () =>
    {
        console.log('Logging out, goodbye!');
        KeratinAuthN.logout();
    }

    render() {
        return (
            <ButtonToolbar>
                <ButtonGroup>
                    <Button onClick={this.logout} active variant="warning">{`${this.props.username}: Logout`}</Button>
                </ButtonGroup>
            </ButtonToolbar>
        )
        
    }
}

export default UserProfile

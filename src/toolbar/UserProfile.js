import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import {ButtonGroup, ButtonToolbar} from "react-bootstrap";
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
    }

    componentWillReceiveProps()
    {
        this.setState({'username': localStorage.getItem("username")});
    }

    logout = () =>
    {
        console.log('Logging out, goodbye!');
        KeratinAuthN.logout();
        localStorage.removeItem('username');
    }

    render() {
        return (
            <ButtonToolbar>
                <ButtonGroup>
                    <Button onClick={this.logout} active variant="warning">{`${this.state.username}: Logout`}</Button>
                </ButtonGroup>
            </ButtonToolbar>
        )
        
    }
}

export default UserProfile

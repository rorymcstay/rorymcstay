import React from 'react';
// Auth
import Cookies from 'js-cookie';


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
    }

    render() {
        // TODO if authorsed load component else load login page.
        // TODO overlay the authorised component with a user toolbar.
        return <>{this.children}</>;
    }
}

// Intentionally defined here so we can load children depending on the sate of there request
export default connect((props) => ({
    // TODO proxy these calls to an api server

    // TODO here we want an is logged in endpoint. Sending sessiontoken if found in cookies. 
    // Server then verifies that 1. to ensure it is in date and 2. if it is valid
    // if not then no session token.
    // TODO Should use authn refresh here and try with the stored refresh token. Only store the 
    // refresh token...
    //
    isVerified: {
        // TODO here we should use directly the keratin authn backend 
        // call to refresh endpoint
        // https://keratin.github.io/authn-server/#/
        url: `/session/refresh`
        // TODO will return a 401 unauthorised - revert to login screen
    },
    // TODO login method
    login: (username, password) => ({
        loginRequest: {
            // TODO: Store refresh token in cookies
            url: `/session`
        }
    }),
    createAccount: (username, password, userData) => ({
        url: `/session`,
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    logOut: (username, password) => ({
        url: `/session`,
        method: `DELETE`
    })
})(AuthWrapper))
/*
ReactDOM.render(<Auth user={user}/>, document.getElementById('root'));
*/

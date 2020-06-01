// api-connector.js
import { connect } from 'react-refetch'
import urlJoin from 'url-join'
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';
import {AUTH_URL} from './auth-config'



export default connect.defaults({
  buildRequest: function (mapping) {
    mapping.headers.authn = KeratinAuthN.session();
    console.log(`AuthN session is ${mapping.headers.authn}`);
    const options = {
      method: mapping.method,
      headers: mapping.headers,
      credentials: mapping.credentials,
      redirect: mapping.redirect,
      mode: mapping.mode,
      body: mapping.body
    }

    return new Request(mapping.url, options)
  }
})


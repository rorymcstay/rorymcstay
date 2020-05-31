// api-connector.js
import { connect } from 'react-refetch'
import urlJoin from 'url-join'
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';
import {AUTH_URL} from './auth-config'

const baseUrl = 'http://localhost:3000/'


export default connect.defaults({
  buildRequest: function (mapping) {
    console.log(`AuthN session is ${KeratinAuthN.session()}`);
    const options = {
      method: mapping.method,
      headers: {authn: KeratinAuthN.session()},
      credentials: mapping.credentials,
      redirect: mapping.redirect,
      mode: mapping.mode,
      body: mapping.body
    }

    return new Request(urlJoin(baseUrl, mapping.url), options)
  }
})


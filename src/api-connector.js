// api-connector.js
import { connect } from 'react-refetch'
import urlJoin from 'url-join'
import {AUTH_URL} from './auth-config'



export default connect.defaults({
  buildRequest: (mapping) => {
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


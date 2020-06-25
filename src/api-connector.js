// api-connector.js
import { connect } from 'react-refetch'
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
    const url = mapping.url[0] === '/' ? `/api${mapping.url}` : `/api/${mapping.url}`;

    return new Request(url, options);
  }
})


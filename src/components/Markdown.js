import Iframe from 'react-iframe';
import React, {Component} from 'react';

class DocViewer extends Component {

    render()
    {
        return (
            <Iframe
                width="100%"
                height="800px"
                url={this.props.uri}
            />
        );
    }

}
export default DocViewer;

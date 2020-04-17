import React, {Component} from "react";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';


class SampleViewer extends Component {


    render() {
        const {sampleUrl} = this.props;
        if (sampleUrl.pending) {
            return <ReactLoading/>
        } else if (sampleUrl.rejected) {
            return <div>Error</div>
        } else if (sampleUrl.fulfilled) {
            
            return (
                <Iframe
                    width="100%"
                    height="60%"
                    url={`/feedjobmanager/getSamplePage/${this.props.feedName}`}
                />
            );
        }
    }
}


export default connect(props => ({
    sampleUrl: {
        url: `/sampler/getSampleUrl/${props.feedName}`
    },
}))(SampleViewer)

import React, {Component} from "react";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import Iframe from 'react-iframe';


class SampleViewer extends Component {


    render() {
        const {sampleData} = this.props;
        if (sampleData.pending) {
            return <ReactLoading/>
        } else if (sampleData.rejected) {
            return <div>Error</div>
        } else if (sampleData.fulfilled) {
            
            const columns = [
                {accessor: "html", Header: "html"}
            ]
            return (
                <Iframe
                    url={sampleData.value.url}
                />
            );
        }
    }
}


export default connect(props => ({
    sampleData: {
        url: `/sampler/getSampleUrl/${props.feedName}`
    },
}))(SampleViewer)

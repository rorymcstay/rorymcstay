
import React, {Component} from "react";
import {connect} from 'react-refetch'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import ReactTable from "react-table";
import Axios from "axios";


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
                <ReactTable
                    style={{width: "100%"}}
                    data={sampleData.value.data}
                    columns={columns}
                    defaultPageSize={10}
                />
            );
        }
    }
}


export default connect(props => ({
    sampleData: {
        url: `/feedmanager/getSampleData/${props.feedName}`
    },
}))(SampleViewer)

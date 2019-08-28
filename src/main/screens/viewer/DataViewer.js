import React, {Component} from "react";
import {connect} from 'react-refetch'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import ReactTable from "react-table";


class DataViewer extends Component {

    render() {
        if (!this.props.triggered) {
            return <div>Enter query and go</div>
        }
        const {data} = this.props;
        if (data.pending) {
            return <ReactLoading/>
        } else if (data.rejected) {
            return <div>Error</div>
        } else if (data.fulfilled) {
            if (this.props.triggered) {
            return (
                <ReactTable
                    data={data.value.data}
                    columns={data.value.columns}
                    defaultPageSize={this.props.pageSize}
                />
            );
            }
        }
    }
}


export default connect(props => ({
    data: {
        url: `/tablemanager/getResults/${props.pageSize}/${props.pageNumber}`,
        body: JSON.stringify(props.queryObject),
        method: 'PUT'
    }
}))(DataViewer)

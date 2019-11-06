import React, {Component} from "react";
import {connect} from 'react-refetch'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import ReactTable from "react-table";


class DataViewer extends Component {

    constructor(props) {
        super();
        this.state = {
            pages: props.page,
            pageSize: props.pageSize,
            pageNumber: props.pageNumber
        }

    }
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
                        style={{ width: "50%" }}
                        data={data.value.data}
                        pages={this.state.pages}
                        columns={data.value.columns}
                        defaultPageSize={this.props.pageSize}
                        manual
                        onFetchData={(state, instance) => {
                            this.props.onNextPage(state);
                            this.setState({pages: state.pages});
                        }}
                    />
                );
            }
        }
    }
}


export default connect(props => ({
    data: {
        url: `/tablemanager/getResults/${props.pageNumber}/${props.pageSize}`,
        body: JSON.stringify(props.queryObject),
        method: 'PUT'
    }
}))(DataViewer)

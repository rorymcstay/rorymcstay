import React, {Component} from "react";
import {connect} from 'react-refetch'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import ReactTable from "react-table";
import Axios from "axios";


class DataViewer extends Component {

    constructor(props) {
        super();
        this.state = {
            pages: -1,
            pageSize: 10,
            page: 1,
            loading: true,
            data: []
        }

    }

    render() {
        if (!this.props.triggered) {
            return <div>Enter query and go</div>
        }
        const {columnValues} = this.props;
        if (columnValues.pending) {
            return <ReactLoading/>
        } else if (columnValues.rejected) {
            return <div>Error</div>
        } else if (columnValues.fulfilled) {

            return (
                <ReactTable
                    style={{width: "100%"}}
                    data={this.state.data}
                    pageSize={this.state.pageSize}
                    pages={this.state.pages}
                    page={this.state.page}
                    columns={columnValues.value}
                    defaultPageSize={10}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                    loading={this.state.loading}
                    manual
                    onFetchData={
                        (state, instance) => {
                            this.setState({loading: true});
                            Axios.post(`/tablemanager/getResults/${state.page}/${state.pageSize}`,
                                this.props.queryObject).then((res) => {

                                this.setState({
                                    data: res.data.data,
                                    pages: res.data.pages,
                                    loading: false,
                                    columns: res.columns,
                                })
                            })
                        }
                    }
                    onPageChange={page => {
                        this.setState({page: page});
                    }}
                    onPageSizeChange={(pageSize, page) => {
                        this.setState({
                            page: page,
                            pageSize: pageSize
                        })
                    }}
                />
            );
        }
    }
}


export default connect(props => ({
    columnValues: {
        url: `/tablemanager/getColumnSchema/${props.tableName}`
    },
}))(DataViewer)

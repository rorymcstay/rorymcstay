import React, { Component } from "react";
import ReactLoading from 'react-loading';
import { connect } from 'react-refetch'
import ReactTable from "react-table";


class JobStatus extends Component {
    render() {

        const columns = [
            {
                Header: "Job Name",
                accessor: "job_name"
            },
            {
                Header: "Next Run",
                accessor: "next_run"
            },
            {
                Header: "Trigger Type",
                accessor: "trigger"
            }
        ];

        const {data} = this.props;
        if (data.pending) {
            return <ReactLoading/>
        } else if (data.rejected) {
            return <div>Error</div>
        } else if (data.fulfilled) {
            return (
                <ReactTable
                    data={data.value.jobs}
                    columns={columns}
                />
            );
        }
    }
}

export default connect(props => ({
    data: {
        url: `/schedulemanager/getStatus`
    }
}))(JobStatus)

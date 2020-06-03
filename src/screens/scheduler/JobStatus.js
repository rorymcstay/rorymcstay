import React, { Component } from "react";
import ReactLoading from 'react-loading';
import connect from '../../api-connector'
import ReactTable from "react-table";


class JobStatus extends Component {
    render() {

        const columns = [
            {
                Header: "Job Name",
                accessor: "job_name"
            },
            {
                Header: "Job ID",
                accessor: "job_id"
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
            // TODO Complete job table with drop down results on clicking row
            return (
                <ReactTable
                    style={{width: "100%"}}
                    data={data.value.jobs}
                    columns={columns}
                    defaultPageSize={10}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                />
            );
        }
    }
}

export default connect(props => ({
    data: {
        url: `/schedulemanager/getStatus/`
    }
}))(JobStatus)

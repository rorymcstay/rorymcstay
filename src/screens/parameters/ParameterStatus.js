import React, {Component} from "react";
import ReactLoading from 'react-loading';
import connect from '../../api-connector.js'
import ReactTable from "react-table";
import "react-table/react-table.css";


class ParameterStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionChainName: props.actionChainName,
        }
    }

    renderStatusTable = (data) => {
        const columns = [
            {
                Header: "name",
                accessor: "name"
            },
            {
                Header: "errors",
                accessor: "errors"
            }
        ];

        return (
            <ReactTable
                columns={columns}
                data={data}
            />
        )

    };

    render() {

        const {parameterStatus} = this.props;

        if (parameterStatus.pending) {
            return <ReactLoading/>
        } else if (parameterStatus.rejected) {
            return <div>Error</div>
        } else if (parameterStatus.fulfilled) {
            return this.renderStatusTable(parameterStatus.value)
        }

    }
}


export default connect(props => ({
    parameterStatus: {
        url: `/feedmanager/getParameterStatus/${props.actionChainName}`
    }
}))(ParameterStatus)

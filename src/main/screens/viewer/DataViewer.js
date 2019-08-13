import React, {Component} from "react";
import ReactLoading from 'react-loading';
import {connect} from 'react-refetch'
import ReactTable from "react-table";
import "react-table/react-table.css";


class DataViewer extends Component {

    render() {

        const columns = [
            {
                Header: "Description",
                accessor: "description"
            },
            {
                Header: "url",
                accessor: "url"
            },
            {
                Header: "price",
                accessor: "price"
            },
            {
                Header: "attributes",
                accessor: "attrs"
            },
            {
                Header: "image",
                accessor: "img",
                Cell: (row) => {
                    return <div><img height={100} src={row.original.imgs[0]} alt='boohoo'/></div>
                },
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
                    data={data.value}
                    columns={columns}
                />
            );
        }
    }
}

export default connect(props => ({
    data: {
        url: `/search/getResultSummaries/${props.feedName}/${props.searchField}/${props.searchString}`
    }
}))(DataViewer)

import React, {Component} from "react";
import ReactLoading from 'react-loading';
import {connect} from 'react-refetch'
import ReactTable from "react-table";
import "react-table/react-table.css";
import {Button} from "react-bootstrap";


class DataViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedName: props.feedName
        }
    }

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

        if (this.props.triggered) {
            return (
                this.props.renderDataViewer(columns)
            );
        } else {
            return <div>Enter query and go</div>
        }



    }
}

export default DataViewer

import React, {Component} from "react";
import connect from '../../../api-connector'
import "react-table/react-table.css";
import ReactLoading from "react-loading";
import ReactTable from "react-table";
import Axios from "axios";
import {Grid, Row, ButtonGroup, Button } from "semantic-ui-react";


class DataViewer extends Component {

    constructor(props) {
        super();
        let mapping = {};
        this.state = {
            pages: -1,
            pageSize: 10,
            page: 1,
            loading: true,
            data: [],
            mapping: mapping
        }

    }

    onMappingChange = (event, oldMapping) =>
    {
        oldMapping[event.target.name] = event.target.value;
        this.setState({mapping: oldMapping});
    }

    onUploadMapping = () =>
    {
        const payload = {
            tableName: this.props.tableName,
            mapping: this.state.mapping 
        };
        this.props.uploadMapping(payload);
    }

    render() {
        if (!this.props.triggered) {
            return <div>Enter query and go</div>
        }
        const {columnValues} = this.props;
        const {mappingValue} = this.props;
        if (columnValues.pending) {
            return <ReactLoading/>
        } else if (columnValues.rejected) {
            return <div>Error</div>
        } else if (columnValues.fulfilled) {
           /* 
            var emptyRow = {};
            for (var i = 0; i < columnValues.value.size(); i++)
            {
                emptyRow[columnValues.value[i]] = "";
            }
            this.state.data.unshift(emptyRow);*/
            var columns = [];
            if (mappingValue.pending)
            {
                return <ReactLoading/>;
            }
            let mapping = {};
            if (mappingValue.fulfilled)
            {
                mapping = mappingValue.value;
            }
            else if (mappingValue.rejected)
            {
                mapping = {};
            }

            for (var i=0; i < columnValues.value.length; i++)
            {
                const name = columnValues.value[i].accessor;
                var newCol = {
                    Footer: (
                        <input type="text" name={name}
                               value={mapping[name]}
                               onChange={(event) => this.onMappingChange(event, mapping)}
                        /> 
                    )
                }
                for (var attr in columnValues.value[i])
                {
                    newCol[attr] = columnValues.value[i][attr];
                }
                columns.unshift(newCol);
            }

            return (
                <Grid columns={1}>
                <Grid.Row>
                <ReactTable
                    style={{width: "100%"}}
                    data={this.state.data}
                    pageSize={this.state.pageSize}
                    pages={this.state.pages}
                    page={this.state.page}
                    columns={columns}
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
                /></Grid.Row>
                <Grid.Row>
                <ButtonGroup>
                    <Button onClick={this.onUploadMapping}>
                        Save Mapping
                    </Button>
                </ButtonGroup></Grid.Row>
                </Grid>
            );
        }
    }
}


export default connect(props => ({
    columnValues: {
        url: `/tablemanager/getColumnSchema/${props.tableName}`
    },
    mappingValue: {
        // TODO: This should send the capture name and action chain name to get the correct mapping
        url: `/tablemanager/getMappingValue/map/${props.feedName}`
    },
    uploadMapping: (payload) => ({
        uploadParamResponse: {
            url: `/tablemanager/uploadMapping/${props.feedName}`,
            body: JSON.stringify(payload),
            method: 'PUT'
        }
    }),
}))(DataViewer)

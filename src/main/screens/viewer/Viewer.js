import React, {Component} from "react";
import DataViewer from "./DataViewer";
import QueryConstructor from "./QueryConstructor";
import {Dropdown, Grid} from "semantic-ui-react";
import {connect} from "react-refetch";
import ReactLoading from "react-loading";
import ReactTable from "react-table";


class Viewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            querySchemaName: "sql_predicate",
            query: undefined,
            triggered: false,
            kind: undefined
        }
    }

    renderDataViewer = (columns) => {
        const {results} = this.props;
        if (results.fulfilled) {
            return (
                <ReactTable
                    data={results.value}
                    columns={columns}
                />)
        } else if (results.pending) {
            return <ReactLoading/>
        } else if (results.rejected) {
            return <div>Error</div>
        } else {
            return <div>Search...</div>
        }
    };

    onSearch = () => {
        const query ={
                kind: this.state.kind,
                value: this.state.query
            };
        this.setState({
            triggered: true
        }, this.props.getResults(query))
    };

    onKindChange = value =>{
        this.setState({
            kind: value
        })
    };

    onQueryChange = (value) => {
        this.setState({query: value})
    };

    render() {

        const {schemaOptions} = this.props;
        if (schemaOptions.pending) {
            return <ReactLoading/>

        } else if (schemaOptions.rejected) {
            return <div>Error</div>

        } else if (schemaOptions.fulfilled) {
            return (
                <Grid columns={2}>
                    <Grid.Row>
                        <QueryConstructor
                            querySchemaName={this.state.querySchemaName}
                            onSearch={this.onSearch}
                            onKindChange={this.onKindChange}
                            onQueryChange={this.onQueryChange}
                        />
                    </Grid.Row>
                    <Grid.Row>
                    <DataViewer
                        renderDataViewer={this.renderDataViewer}
                        triggered={this.state.triggered}
                    />
                    </Grid.Row>
                </Grid>
            )
        }
    }
}

export default connect(props => ({
    schemaOptions: {
        url: `/search/getSchemaList/`
    },
    getResults: (query) => ({
        results: {
            url: `/search/getResults/${props.feedName}`,
            body: JSON.stringify(query),
            method: 'PUT'
        }
    })
}))(Viewer)
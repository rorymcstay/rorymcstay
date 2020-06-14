import React, {Component} from "react";
import DataViewer from "./DataViewer";
import QueryConstructor from "./QueryConstructor";
import {Dropdown, Grid} from "semantic-ui-react";
import connect from "../../api-connector";
import ReactLoading from "react-loading";


class Viewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableName: undefined,
            predicates: "",
            pageSize: 5,
            triggered: false,
            kind: undefined,
            columns: '*',
            pages: undefined
        }
    }

    onNextPage = (state) => {
        this.setState({
            pages: state.pages,
            pageNumber: state.page,
            pageSize: state.pageSize
        })
    };

    onSearch = () => {
        this.setState({
            triggered: true,
            queryObject: {
                tableName: this.state.tableName,
                predicates: this.state.predicates,
                columns: this.state.columns
            }
        })
    };

    onTableChange = (e, {value}) => {
        this.setState({
            tableName: value
        });
        console.debug(`selected tableName=${this.state.tableName}`);
    };

    onQueryChange = (value) => {
        this.setState({predicates: value})
    };

    render() {

        const {tableOptions} = this.props;
        if (tableOptions.pending) {
            return <ReactLoading/>

        } else if (tableOptions.rejected) {
            return <div>Error</div>
        } else if (!this.state.triggered && tableOptions.fulfilled) {
            const menuOptions = [];
            for (let i = 0; i < tableOptions.value.length; i++) {
                menuOptions.push({
                    key: tableOptions.value[i],
                    value: tableOptions.value[i],
                    text: tableOptions.value[i]
                });
            }
            return (
                <div>
                    <Dropdown
                        placeholder='Table name'
                        fluid
                        search
                        selection
                        onChange={this.onTableChange}
                        options={menuOptions}
                    />
                    <QueryConstructor
                        tableName={this.state.tableName}
                        onSearch={this.onSearch}
                        onQueryChange={this.onQueryChange}
                    />
                </div>)
        } else if (tableOptions.fulfilled) {
            const menuOptions = [];
            for (let i = 0; i < tableOptions.value.length; i++) {
                menuOptions.push({
                    key: tableOptions.value[i],
                    value: tableOptions.value[i],
                    text: tableOptions.value[i]
                });
            }
            return (
                <Grid columns={1}>
                    <Grid.Row>
                        <Dropdown
                            placeholder='Table name'
                            fluid
                            search
                            selection
                            onChange={this.onTableChange}
                            options={menuOptions}
                        />
                        <QueryConstructor
                            tableName={this.state.tableName}
                            onSearch={this.onSearch}
                            onQueryChange={this.onQueryChange}
                        />
                    </Grid.Row>
                    {/*this should be a render function for triggered*/}
                    <Grid.Row>
                        <DataViewer
                            alert={this.props.alert}
                            actionChainName={this.props.actionChainName}
                            tableName={this.state.tableName}
                            triggered={this.state.triggered}
                            queryObject={this.state.queryObject}
                        />
                    </Grid.Row>
                </Grid>
            )
        }
    }
}

export default connect(props => ({
    tableOptions: {
        url: `/tablemanager/getTableNames/${props.actionChainName}`
    }
}))(Viewer)

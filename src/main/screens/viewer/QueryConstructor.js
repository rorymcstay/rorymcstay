import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {Dropdown, Grid, Input} from "semantic-ui-react";
import ReactLoading from "react-loading";
import {connect} from "react-refetch";


class QueryConstructor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            querySchemaName: props.querySchemaName,
            value: "",
            kind: undefined

        }
    }

    onKindChange = (e, {value}) => {
        this.setState({
            kind: value
        }, this.props.onKindChange(value))
    };

    onQueryChange = (e, {value}) => {
        this.setState({
            query: value
        }, this.props.onQueryChange(value))
    };

    onSearch = () => {
        this.props.onSearch()
    };

    render() {
        const kindOptions = [
            {
                key: 1,
                value: "items",
                text: "Items"
            },
            {
                key: 2,
                value: "results",
                text: "Results"
            }
        ];
        const {querySchema} = this.props;
        if (querySchema.pending) {
            return <ReactLoading/>
        } else if (querySchema.rejected) {
            return <div>Error</div>
        } else if (querySchema.fulfilled) {

            return (
                <Grid columns={3}>
                    <Grid.Column >
                        <Dropdown
                            placeholder='Select kind'
                            fluid
                            search
                            selection
                            onChange={this.onKindChange}
                            options={kindOptions}
                        />
                    </Grid.Column>
                    <Grid.Column >
                        <Input focus
                               placeholder='SQL Predicate...'
                               onChange={this.onQueryChange}
                        />
                    </Grid.Column>
                <Grid.Column>
                    <Button onClick={this.onSearch}>Search</Button>
                </Grid.Column>
                </Grid>
            )
        }
    }
}


export default connect(props => ({
    querySchema: {
        url: `/search/getQuerySchema/${props.querySchemaName}`
    }
}))(QueryConstructor)
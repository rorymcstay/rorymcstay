import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import { Grid, Input} from "semantic-ui-react";


class QueryConstructor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            predicates: ""
        }
    }

    onQueryChange = (e, {value}) => {
        this.setState({
            predicates: value
        }, this.props.onQueryChange(value))
    };

    onSearch = () => {
        this.props.onSearch()
    };

    render() {


        return (
            <Grid columns={2}>
                <Grid.Column>
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


export default QueryConstructor

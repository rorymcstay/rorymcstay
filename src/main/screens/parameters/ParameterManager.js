import React, {Component} from "react";
import FormViewer from "./FormViewer";
import Button from "react-bootstrap/Button";
import ReactLoading from 'react-loading';
import {connect} from 'react-refetch'
import ParameterStatus from "./ParameterStatus";
import {Dropdown, Grid} from "semantic-ui-react";


class ParameterManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameterType: props.parameterType,
            feedName: props.feedName,
            isLoaded: false
        }
    }

    handleMenuChange = (e, {value}) => {
        this.setState({
            parameterType: value
        }, this.props.onParameterChange(value))
    };

    createNew = e => {
        this.setState({
            feedName: e.target.value
        })
    };


    render() {
        const {parameterTypes} = this.props;

        if (parameterTypes.pending) {
            return <ReactLoading/>
        } else if (parameterTypes.rejected) {
            return <Button onClick={this.createNew}>Create</Button>
        } else if (parameterTypes.fulfilled) {
            const menuOptions = [];
            for (let i = 0; i < parameterTypes.value.length; i++) {
                menuOptions.push({
                    key: parameterTypes.value[i],
                    value: parameterTypes.value[i],
                    text: parameterTypes.value[i]
                });
            }

            return (
                <div>
                    <Grid rows={2}>
                        <Grid.Row>
                            <Dropdown
                                placeholder='Select parameter type'
                                fluid
                                search
                                selection
                                onChange={this.handleMenuChange}
                                options={menuOptions}
                            /></Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <FormViewer
                                    parameterType={this.state.parameterType}
                                    feedName={this.props.feedName}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <ParameterStatus
                                    feedName={this.state.feedName}
                                    parameterName={this.state.parameterType}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            );
        }
    }
}

export default connect(props => ({
    parameterTypes: `/api/feedmanager/getParameterTypes/`
}))(ParameterManager)
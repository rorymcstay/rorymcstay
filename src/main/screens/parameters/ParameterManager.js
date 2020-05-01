import React, {Component} from "react";
import FormViewer from "./FormViewer";
import Button from "react-bootstrap/Button";
import ReactLoading from 'react-loading';
import connect from '../../../api-connector'
import ParameterStatus from "./ParameterStatus";
import {Dropdown, Grid} from "semantic-ui-react";


class ParameterManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameterType: props.parameterType
        }
    }

    handleMenuChange = (e, {value}) => {
        this.setState({
            parameterType: value
        }, this.props.onParameterChange(value))
    };

    render() {
        const {parameterTypes} = this.props;

        if (parameterTypes.pending) {
            return <ReactLoading/>
        } else if (parameterTypes.rejected) {
            return <div>Error</div>
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
                                    actionChainName={this.props.actionChainName}
                                    parameterType={this.state.parameterType}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <ParameterStatus
                                    actionChainName={this.props.actionChainName}
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
    parameterTypes: `/feedmanager/getParameterTypes/`
}))(ParameterManager)

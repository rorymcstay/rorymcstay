import React, { Component } from "react";
import FormViewer from "./FormViewer";
import Button from "react-bootstrap/Button";
import ReactLoading from 'react-loading';
import { connect } from 'react-refetch'


class ParameterManager extends Component {
    constructor(props) {
        super();
        this.state = {
            parameterType: "feed",
            feedName: props.feedName,
            isLoaded: false
        }
    }

    handleMenuChange = event => {
        this.setState({
            parameterType: event.target.value,

        })
    };

    createNew = e => {
        this.setState({
            feedName: e.target.value
        })
    };

    render() {
        const { parameterTypes } = this.props;

        if (parameterTypes.pending) {
            return <ReactLoading/>
        } else if (parameterTypes.rejected) {
            return <Button onClick={this.createNew}>Create</Button>
        } else if (parameterTypes.fulfilled) {
            let menuItems = JSON.parse(parameterTypes.value).map((parameterType) =>
                <option
                    value={parameterType}
                    key={parameterType}
                >
                    {parameterType}
                </option>
            );
            return (
                <div>
                    <form>
                        <select
                            value={this.state.parameterType}
                            onChange={this.handleMenuChange}
                        >
                            {menuItems}
                        </select>
                    </form>
                    <button onClick={e => this.createNew(e)}>Submit</button>
                    <FormViewer
                        parameterType={this.state.parameterType}
                        feedName={this.props.feedName}
                    />
                </div>
            );
        }
    }
}

export default connect(props => ({
    parameterTypes: `http://localhost:5004/feedmanager/getParameterTypes`
}))(ParameterManager)
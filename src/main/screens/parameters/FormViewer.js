import React, { Component } from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import { connect } from 'react-refetch'


class FormViewer extends Component {
    constructor(props) {
        super();
        this.state = {
            parameterSchema: props.parameterSchema,
            parameterName: props.parameterName,
            feedName: props.feedName
        }
    }

    render() {
        const onSubmit = ({formData}, e) => this.props.uploadParam(formData);
        const { parameterSchema } = this.props;
        const { parameterValue } = this.props;
        if (this.props.parameterType === undefined) {
            return (<div>Select parameter type</div>)
        }
        if (parameterSchema.pending) {
                return <ReactLoading/>
        } else if (parameterSchema.rejected) {
            return <div>Error</div>
        } else if (parameterSchema.fulfilled ) {
            if (parameterValue.fulfilled) {
                const formData= parameterValue.value;
                return (
                <div>
                    <Form schema={parameterSchema.value}
                          onSubmit={onSubmit}
                          formData={formData}
                    />
                </div>
            );
            } else if (parameterValue.pending) {
                return <ReactLoading/>
            } else if (parameterValue.rejected) {
                return (
                <div>
                    <Form schema={parameterSchema.value}
                          onSubmit={onSubmit}
                    />
                </div>
                );
            }

        }
    }
}

export default connect(props => ({
    parameterSchema: {
        url: `http://localhost:5004/feedmanager/getParameterSchema/${props.parameterType}`
    },
    parameterValue: {
        url: `http://localhost:5003/parametercontroller/getParameter/${props.parameterType}/${props.feedName}`
    },
    uploadParam: (formData) => ({
        uploadParamResponse: {
            url: `http://localhost:5003/parametercontroller/setParameter/${props.parameterType}/${props.feedName}`,
            body: JSON.stringify(formData),
            method: 'PUT'
        }
    })
}))(FormViewer)

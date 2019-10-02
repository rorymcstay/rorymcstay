import React, { Component } from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import { connect } from 'react-refetch'


class FormViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameterType: props.parameterType,
            feedName: props.feedName,
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
                    <Form schema={parameterSchema.value}
                          onSubmit={onSubmit}
                    />
                );
            }

        }
    }
}

export default connect(props => ({
    parameterSchema: {
        url: `/api/feedmanager/getParameterSchema/${props.parameterType}`
    },
    parameterValue: {
        url: `/api/feedmanager/getParameter/${props.parameterType}/${props.feedName}`
    },
    uploadParam: (formData) => ({
        uploadParamResponse: {
            url: `/api/feedmanager/setParameter/${props.parameterType}/${props.feedName}`,
            body: JSON.stringify(formData),
            method: 'PUT'
        }
    })
}))(FormViewer)

import React, { Component } from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import { connect } from 'react-refetch'


class Mapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameterType: props.parameterType,
            feedName: props.feedName,
        }
    }

    render() {
        const onSubmit = ({formData}, e) => this.props.uploadMapping(formData);
        const { parameterSchema: mappingSchema } = this.props;
        const { parameterValue: mappingValue } = this.props;
        // TODO Mapping should be
        if (mappingSchema.pending) {
                return <ReactLoading/>
        } else if (mappingSchema.rejected) {
            return <div>Error</div>
        } else if (mappingSchema.fulfilled ) {
            if (mappingValue.fulfilled) {
                const formData= mappingValue.value;
                return (
                <div>
                    <Form schema={mappingSchema.value}
                          onSubmit={onSubmit}
                          formData={formData}
                    />
                </div>
            );
            } else if (mappingValue.pending) {
                return <ReactLoading/>
            } else if (mappingValue.rejected) {
                return (
                    <Form schema={mappingSchema.value}
                          onSubmit={onSubmit}
                    />
                );
            }
        }
    }
}

export default connect(props => ({
    mappingSchema: {
        url: `/tablemanager/getMappingSchema/`
    },
    mappingValue: {
        url: `/tablemanager/getMappingValue/${props.feedName}`
    },
    columnValues: {
        url: `/tablemanager/getAllColumns/t_stg_${props.feedName}_results`
    },
    uploadMapping: (formData) => ({
        uploadParamResponse: {
            url: `/feedmanager/uploadMapping/${props.parameterType}/${props.feedName}`,
            body: JSON.stringify(formData),
            method: 'PUT'
        }
    })
}))(Mapping)
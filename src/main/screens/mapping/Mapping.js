import React, {Component} from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import {connect} from 'react-refetch'


class Mapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedName: props.feedName,
        }
    }


    render() {
        const onSubmit = ({formData}, e) => this.props.uploadMapping(formData);
        const {columnValues} = this.props;
        const {mappingValue} = this.props;


        // TODO Mapping should be
        if (columnValues.pending) {
            return <ReactLoading/>
        } else if (columnValues.rejected) {
            return <div>Error</div>
        } else if (columnValues.fulfilled) {
            const mappingSchema = {
                type: "array",
                title: "Mapping",
                items: {
                    type: "object",
                    properties: {
                        final_column_name: {
                            type: "string",
                        },
                        staging_column_name: {
                            type: "string",
                            enum: columnValues.value
                        }
                    }
                }
            };
            if (mappingValue.fulfilled) {
                const formData = mappingValue.value;
                return (
                    <div>
                        <Form schema={mappingSchema}
                              onSubmit={onSubmit}
                              formData={formData}
                        />
                    </div>
                );
            } else if (mappingValue.pending) {
                return <ReactLoading/>
            } else if (mappingValue.rejected) {
                return (
                    <Form schema={mappingSchema}
                          onSubmit={onSubmit}
                    />
                );
            }
        }
    }
}

export default connect(props => ({
    mappingValue: {
        url: `/tablemanager/getMappingValue/${props.feedName}`
    },
    columnValues: {
        url: `/tablemanager/getAllColumns/t_stg_${props.feedName}_results`
    },
    uploadMapping: (formData) => ({
        uploadParamResponse: {
            url: `/tablemanager/uploadMapping/${props.feedName}`,
            body: JSON.stringify(formData),
            method: 'PUT'
        }
    })
}))(Mapping)

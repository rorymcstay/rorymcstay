import React, {Component} from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import {connect} from 'react-refetch'


class Mapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableName: props.tableName,
            feedName: props.feedName
        }
    }

    onSubmit = ({formData}, e) => {
        const payload = {
            tableName: this.state.tableName,
            mapping: formData
        };
        this.props.uploadMapping(payload);
    };

    render() {


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
                              onSubmit={this.onSubmit}
                              formData={formData}
                        />
                    </div>
                );
            } else if (mappingValue.pending) {
                return <ReactLoading/>
            } else if (mappingValue.rejected) {
                return (
                    <Form schema={mappingSchema}
                          onSubmit={this.onSubmit}
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
    uploadMapping: (payload) => ({
        uploadParamResponse: {
            url: `/tablemanager/uploadMapping/${props.feedName}`,
            body: JSON.stringify(payload),
            method: 'PUT'
        }
    })
}))(Mapping)

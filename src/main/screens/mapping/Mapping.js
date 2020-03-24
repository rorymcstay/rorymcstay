import React, {Component} from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import {connect} from 'react-refetch'
import { ButtonGroup, Button } from "semantic-ui-react";


class Mapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableName: props.tableName,
            feedName: props.feedName,
            triggered: false

        }
    };

    DisplayButton = (isRunning, request, name) => 
    {
        if (request)
        {
            if (request.rejected)
            {
                return (
                <Button disabled={true} color='red'>{name}`</Button>
                )
            }
        }
        if (isRunning.fulfilled)
        { 
            const loading = isRunning.value.running;
            return (
                <Button loading={loading}
                        onClick={() => this.onStartMapper(name)}>{`${name}`}
                </Button>
            )
        }

    };

    renderButtons = (isRunningMapper, isRunningSummarizer) =>
    {
        const {mapRequest, sumRequest} = this.props;
        if (!(isRunningMapper.rejected || isRunningSummarizer.rejected))
        {
            return( 
                <ButtonGroup>
                    {this.DisplayButton(isRunningMapper, mapRequest, "Mapper")}
                    {this.DisplayButton(isRunningSummarizer, sumRequest, "Summarizer")}
                </ButtonGroup>
            )
        }
        else
        {
            return <div>Error</div>
        }
    }

    onStartMapper = (name) =>
    {
        if (name === 'Mapper')
        {
            this.props.startMapper();
        } 
        else
        {
            this.props.startSummarizer();
        }
        this.setState({triggered: true});
    }
    

    onSubmit = ({formData}, e) => {
        const payload = {
            tableName: this.props.tableName,
            mapping: formData
        };
        this.props.uploadMapping(payload);
    };

    render() {

        const {columnValues} = this.props;
        const {isRunningMapper} = this.props;
        const {isRunningSummarizer} = this.props;
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

            if (mappingValue.fulfilled && isRunningMapper.fulfilled && isRunningSummarizer.fulfilled) {
                const formData = mappingValue.value;
                return (
                    <div>
                        <Form schema={mappingSchema}
                              onSubmit={this.onSubmit}
                              formData={formData}
                        />
                        {this.renderButtons(isRunningSummarizer, isRunningMapper)}
                    </div>
                );
            } else if (mappingValue.pending || isRunningSummarizer.pending || isRunningMapper.pending) {
                return <ReactLoading/>
            } else if (mappingValue.rejected) {
                return (
                    <div>
                    <Form schema={mappingSchema}
                          onSubmit={this.onSubmit}
                    />
                    </div>
                );
            }
        }
    }
}

export default connect(props => ({
    mappingValue: {
        url: `/tablemanager/getMappingValue/list/${props.feedName}`
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
    }),
    isRunningSummarizer: {
        url: `/mappermanager/isRunning/summarizer` 
    },
    isRunningMapper: {
        url: `/mappermanager/isRunning/persistence`
    },
    startSummarizer: () =>({
        sumRequest: {
            url: `/mappermanager/startSummarizer/`
        }
    }),
    startMapper: () => ({
        mapRequest: {
            url: `/mappermanager/startMapper/`
        }
    })
}))(Mapping)

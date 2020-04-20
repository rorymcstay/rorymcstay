import React, {Component} from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import connect from '../../../api-connector'
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

    renderButtons = (commandStatus) =>
    {
        if (commandStatus.fulfilled)
        {
            let arr = []; 
            for (var i=0; i < commandStatus.value.length; i++)
            {
                let isRunning = commandStatus.value[i].isRunning;
                let name = commandStatus.value[i].name;
                arr.push(
                    <Button color={ isRunning ? 'green' : 'red'}
                            onClick={ () => isRunning ? this.onStop(name) : this.onStart(name) }
                    >
                        {`${commandStatus.value[i].name}`}
                    </Button>);
            }
            return( 
                <ButtonGroup>
                    {arr}
                </ButtonGroup>
            )
        }
        else
        {
            return <div>Error</div>
        }
    }

    onStart = (name) =>
    {
        this.props.start(name);
    }

    onStop = (name) =>
    {
        this.props.stop(name);
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
        const {commandStatus} = this.props;
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

            if (mappingValue.fulfilled && commandStatus.fulfilled) {
                const formData = mappingValue.value;
                return (
                    <div>
                        <Form schema={mappingSchema}
                              onSubmit={this.onSubmit}
                              formData={formData}
                        />
                        {this.renderButtons(commandStatus)}
                    </div>
                );
            } else if (mappingValue.pending || commandStatus.pending) {
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
    commandStatus : {
        url: `/commandmanager/getCommands/`
    },
    start: (name) => ({
        startRequest: {
            url: `/commandmanager/startService/${name}`
        }
    }),
    stop: (name) => ({
        stopRequest: {
            url: `/commandmanager/stopService/${name}`
        }
    })
}))(Mapping)

import React, {Component} from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import connect from '../../api-connector'
import { ButtonGroup, Button } from "semantic-ui-react";
import Loading from "react-loading";


class MappingCommands extends Component {

    DisplayButton = (isRunning, name) => {
        if (isRunning.fulfilled )
        { 
            const colour = isRunning.value.running ? 'Green' : 'Grey'

            return (
                <Button disabled={isRunning.value.running} onClick={this.onStartMapper}>`Start ${name}`</Button>
            )
        }
        else if (isRunning.pending )
        {
            return <Loading>Mappers are loading</Loading>;
        }
    };

    renderButtons(isRunningMapper, isRunningSummarizer)
    {
        if (!(isRunningSummarizer.value.rejected || isRunningSummarizer.rejected))
        {
            return( 
                <ButtonGroup>
                    <this.DisplayButton isRunning={isRunningMapper} name="Mapper"/> 
                    <this.DisplayButton isRunning={isRunningSummarizer} name="Summarizer"/> 
                </ButtonGroup>
            )
        }
        else
        {
            return <div>Error</div>
        }
    }

    onStartMapper()
    {
        this.props.startMapper();
        this.setState({triggered: true});
    }
    
    onStartSummarizer()
    {
        this.props.startSummarizer();
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


        const {isRunningMapper} = this.props;
        const {isRunningSummarizer} = this.props;

        // TODO Mapping should be
        if (isRunningMapper.pending || isRunningSummarizer.pending) {
            return <ReactLoading/>
        } else if (isRunnignMapper.rejected) {
            return <div>Error</div>
        } else if (isRunningSummarizer.fulfilled) {
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
        url: `/mappermanager/isRunning/summarizer`, refreshInterval: 10000  
    },
    isRunningMapper: {
        url: `/mappermanager/isRunning/persistence`, refreshInterval: 10000
    },
    startSummarizer: () =>({
        summarizerLoading: {
            url: `/mappermanager/startSummarizer/`
        }
    }),
    startMapper: () => ({
        mapperLoading: {
            url: `/mappingmanager/startMapper/`
        }
    })
}))(MappingCommands)

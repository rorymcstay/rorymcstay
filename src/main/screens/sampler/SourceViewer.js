import React, {Component} from "react";
import Iframe from 'react-iframe';
import ReactLoading from "react-loading";
import connect from '../../../api-connector';

  
class SourceViewer extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            chainName: props.actionChainName,
            srcUrl: props.srcUrl,
            chainPosition: props.position
        }
    }

    componentWillReceiveProps = (nextProps) =>
    {
        this.setState({
            chainName: nextProps.actionChainName, 
            srcUrl: nextProps.srcUrl, 
            chainPosition: nextProps.position
        });
    }

    getPreviousAvailableSource = (sourceStatus, initialPosition) =>
    {
        if (initialPosition - 1 <= 0) {
            return 0;
        }
        else if (sourceStatus[initialPosition - 1] && sourceStatus[initialPosition - 1].ready) {
            return initialPosition - 1;
        } else {
            return this.getPreviousAvailableSource(sourceStatus, initialPosition - 1);
        }
    }

    render ()
    {
        const {sourcesReady} = this.props;
        if (sourcesReady.pending)
        {
            return <ReactLoading/>;
        } else if (sourcesReady.rejected) {
            return <div>Error</div>;
        } else if (sourcesReady.fulfilled)
        {
 
            const sourceStatus = sourcesReady.value;
            if (sourceStatus.length === 0)
            {
                return <div>Select a chain</div>
            }
            var displaying = this.props.position;
            if (sourceStatus[displaying] === undefined || !sourceStatus[displaying].ready) {
                displaying = this.getPreviousAvailableSource(sourceStatus, displaying);
                // TODO get the previous available source
            }
            return (
                    <Iframe
                        width="100%"
                        height="800px"
                        url={`/samplepages/getSamplePage/${this.props.actionChainName}/${displaying}`}
                    />
            );
        }
    }
}

export default connect(props => ({
    sourcesReady: {
        url: `/samplepages/getSourceStatus/${props.actionChainName}`
    }
}))(SourceViewer);


import React, {Component} from "react";
import Iframe from 'react-iframe';
  
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

    render ()
    {
        return (<Iframe
            width="100%"
            height="800px"
            url={`/feedjobmanager/getSamplePage/${this.props.actionChainName}/${this.props.position}`}
        />
        );
    }
}

export default SourceViewer;
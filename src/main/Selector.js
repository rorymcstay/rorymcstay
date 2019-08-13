import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import {Dropdown} from "semantic-ui-react";

class Selector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            feedName: "",
            searchField: "",
            searchString: ""
        }

    }

    handleChange = (e, { value }) => {
        this.props.onFeedChange(value)
    };




    render() {
        const {fetchFeeds} = this.props;
        if (fetchFeeds.pending) {
            return <ReactLoading height={667} width={375}/>
        } else if (fetchFeeds.rejected) {
            return <div>Error</div>
        } else if (fetchFeeds.fulfilled) {
            const menuOptions = [];
            for(let i = 0; i < fetchFeeds.value.length; i++) {
                menuOptions.push({
                    key: fetchFeeds.value[i],
                    value: fetchFeeds.value[i],
                    text: fetchFeeds.value[i]
                })
            }
            return (
                <div>
                    <Dropdown
                        placeholder='Select Feed'
                        fluid
                        search
                        selection
                        onChange={this.handleChange}
                        options={menuOptions}
                    />

                </div>
            )
        }

    }
}

export default connect(props => ({
    fetchFeeds: {
        url: `http://localhost:5004/feedmanager/getFeeds/`
    }
}))(Selector)
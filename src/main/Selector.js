import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import {connect} from "react-refetch";
import {Dropdown} from "semantic-ui-react";

class Selector extends Component {

    constructor(props) {
        super(props);
        const data = JSON.parse(props.fetchFeeds.value);

        const menuOptions = [];
        for(let i = 0; i < props.fetchFeeds.value; i++) {
            menuOptions.push({
                key: data[i],
                value: data[i],
                text: data[i]
            })
        }
        this.state = {
            feedName: "",
            feedOptions: menuOptions,
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

            return (
                <div>
                    <Dropdown
                        placeholder='Select Feed'
                        fluid
                        search
                        selection
                        onChange={this.handleChange}
                        value={this.state.feedName}
                        options={this.state.feedOptions}
                    />

                </div>
            )
        }

    }
}

export default connect(props => ({
    fetchFeeds: {
        url: `http://localhost:5004/feedmanager/getFeeds`
    }
}))(Selector)
import React, {Component} from "react";
import {connect} from 'react-refetch'
import JobStatus from "./JobStatus";
import {Dropdown} from "semantic-ui-react";
import {Grid} from "semantic-ui-react";
import Button from "react-bootstrap/Button";
import ReactLoading from "react-loading";


class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedName: this.props.feedName,
            url: "",
            trigger: "",
            increment: "",
            increment_size: 0,
            time_out: 0
        }
    }

    onIncrementSizeChange = (e) => {
        this.setState({
            increment_size: e.target.value
        })
    };

    onTriggerChange = (trigger) => {
        this.setState({
            trigger: trigger
        })
    };

    onUrlChange = (value) => {
        this.setState({
            url: value.target.value
        })
    };

    onIncrementChange = (value) => {
        this.setState({
            url: value
        })
    };

    onClick = () => {
        this.props.addJob(this.state);
        const {data} = this.props;
        if (data.pending) {
            return <ReactLoading/>
        } else if (data.rejected) {
            return <div>Error</div>
        } else if (data.fulfilled) {
            this.setState(
                {
                    feedName: this.props.feedName,
                    url: "",
                    trigger: "",
                    increment: "",
                    increment_size: 0,
                    time_out: 0
                })
        }
    };

    render() {
        const triggerOptions = [
            {
                text: "in",
                key: 1,
                value: "date"
            },
            {
                text: "every",
                key: 2,
                value: "interval"
            }
        ];
        const incrementOptions = [
            {
                text: "minutes",
                key: 1,
                value: "minutes"
            },
            {
                text: "seconds",
                key: 2,
                value: "seconds"
            },
            {
                text: "hours",
                key: 3,
                value: "hours"
            }
        ];
        return (
            <div>
                <JobStatus/>
                <Grid columns={3}>
                    <Grid.Column>
                        <Dropdown
                            onChange={this.onTriggerChange}
                            options={triggerOptions}
                            placeholder='trigger'
                            selection
                            value={this.state.trigger}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <input name="searchField"
                               placeholder="Field to Search"
                               value={this.state.searchField}
                               onChange={value => this.onIncrementSizeChange(value)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Dropdown
                            onChange={this.onIncrementChange}
                            options={incrementOptions}
                            placeholder='when'
                            selection
                            value={this.state.increment}
                        />
                    </Grid.Column>
                </Grid>
                <input name="urlField"
                       placeholder="Url to capture"
                       value={this.state.searchField}
                       onChange={value => this.onUrlChange(value)}/>
                <Button
                    variant="primary"
                    onClick={this.onClick}
                >Schedule Job</Button>
            </div>
        )
    }
}

export default connect(props => ({
    addJob: (scheduledJob) => ({
        uploadParamResponse: {
            url: `http://localhost:5003/schedulemanager/addJob/${props.feedName}`,
            body: JSON.stringify(scheduledJob),
            method: 'PUT'
        }
    })
}))(Scheduler)

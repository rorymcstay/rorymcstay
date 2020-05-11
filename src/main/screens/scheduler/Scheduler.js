import React, {Component} from "react";
import connect from '../../../api-connector'
import JobStatus from "./JobStatus";
import {Dropdown, Input} from "semantic-ui-react";
import {Grid} from "semantic-ui-react";
import Button from "react-bootstrap/Button";
import ReactLoading from "react-loading";


class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionChainName: props.actionChainName,
            url: "",
            trigger: "",
            increment: "",
            increment_size: 0,
            time_out: 0
        }
    }

    onServiceChange = (e, {value}) => {
        this.setState({
            service: value
        })
    };

    onIncrementSizeChange = (e) => {
        this.setState({
            increment_size: e.target.value
        })
    };

    onTriggerChange = (e, {value}) => {
        this.setState({
            trigger: value
        })
    };

    onUrlChange = (value) => {
        this.setState({
            url: value.target.value
        })
    };

    onIncrementChange = (e, {value}) => {
        this.setState({
            increment: value
        })
    };

    submissionInfo = () =>
    {
        const {addJobResponse} = this.props;
        if (!this.state.saved)
        {
        }
        else 
        {
            if (addJobResponse.pending)
            {
            }
            else if (!this.state.notified && addJobResponse.rejected)
            {
                this.props.alert.show(`Failed to communicate with schedule manager`);
                this.setState({notified: true});
            } 
            else if (!this.state.notified)
            {   
                if (!addJobResponse.value.valid)
                {
                    this.props.alert.show(`Invalid schedule request: ${addJobResponse.value.reason}`);
                    this.setState({notified: true});
                }
                {
                    this.props.alert.show(`Succesfully scheduled ${this.state.actionChainName} for ${addJobResponse.value.message}`);
                    this.setState({notified: true});
                }
            }
            else
            {}
        }
    }


    onClick = () => {
        const job = {
            url: this.state.url,
            trigger: this.state.trigger,
            increment: this.state.increment,
            increment_size: this.state.increment_size,
            time_out: this.state.time_out
        };
        this.props.addJob(job);
        this.setState(
            {
                actionChainName: this.props.actionChainName,
                url: "",
                saved: true,
                trigger: "",
                increment: "",
                increment_size: 0,
                time_out: 0
            })
    };
    serviceOptions = [
        {
            text: "persistence",
            key: 1,
            value: "feed_persistence"
        },
        {
            text: "summarizer",
            key: 2,
            value: "feed_summarizer"
        }
    ];

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
        this.submissionInfo();
        return (
            <Grid  >
                <Grid.Row width='100%' columns={4}>
                <Grid.Column>
                        <Dropdown
                            onChange={this.onTriggerChange}
                            size='small'
                            options={triggerOptions}
                            placeholder='trigger'
                            selection
                        />
                </Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <Input name="searchField"
                               placeholder="number"
                               value={this.state.increment_size}
                               size='small'
                               onChange={value => this.onIncrementSizeChange(value)}/>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                        <Dropdown
                            onChange={this.onIncrementChange}
                            options={incrementOptions}
                            placeholder='when'
                            selection
                            size='small'
                        />
                </Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <Button
                            variant="primary"
                            onClick={this.onClick}
                        >Schedule Job</Button>
                    </Grid.Row>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <JobStatus/>
                </Grid.Row>
            </Grid>
        )
    }
}

export default connect(props => ({
    addJob: (scheduledJob) => ({
        addJobResponse: {
            // TODO should have this enddpoint without route name
            url: `/schedulemanager/scheduleActionChain/leader-route/${props.actionChainName}`,
            body: JSON.stringify(scheduledJob),
            method: 'PUT'
        }
    })
}))(Scheduler)

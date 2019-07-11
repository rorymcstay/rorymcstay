import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

class Toolbar extends Component {
    constructor(props) {
        super();
        this.state = {
            feeds: props.feeds
        }
    }

    onChange = e => {
        this.props.onChange({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div>
                <form>
                    <input name="feedName"
                        placeholder="Feed Name"
                        value={this.state.feedName}
                        onChange={fields => this.onChange(fields)}/>
                </form>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="secondary">Start</Button>
                    <Button variant="secondary">Stop</Button>
                    <Button variant="secondary">Change</Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default Toolbar
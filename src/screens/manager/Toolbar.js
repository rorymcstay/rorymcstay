import React, { Component } from 'react';
import DropdownList from 'react-widgets/lib/DropdownList'
import { Button, ButtonGroup } from 'react-bootstrap'

class Toolbar extends Component {

    render() {
        let feeds = ["donedeal", "pistonheads"];
        return (
            <div>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="secondary">Start</Button>
                    <Button variant="secondary">Stop</Button>
                    <Button variant="secondary">Change</Button>
                </ButtonGroup>
                <DropdownList
                  data={feeds}
                  defaultValue={"donedeal"}
                />
            </div>
        );
    }
}

export default Toolbar
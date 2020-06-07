/*jshint esversion: 6 */
import React from 'react';

import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
//import HelpBlock from 'react-bootstrap/lib/HelpBlock';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <FormLabel>{label}</FormLabel>
      <FormControl {...props} />
      {/*help && <HelpBlock>{help}</HelpBlock>*/}
    </FormGroup>
  );
}

export default FieldGroup;

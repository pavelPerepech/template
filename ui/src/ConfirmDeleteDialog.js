
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup } from '@mui/material'
import React, { Component } from 'react'

export default class ConfirmDeleteDialog extends Component {
constructor(props) {
  super(props)

  this.state = {
       withChildren: false
  }

  this.handleClose = this.handleClose.bind(this);
}

handleClose(isOk) {
  this.props.onClose(isOk, this.state.withChildren);
}

  render() {
    return (
      <Dialog
        open={this.props.open}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            this.handleClose(true);
          },
        }}
      >
        <DialogTitle>Node delete confirmation</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Delete node: {this.props.node}? 
          </DialogContentText>

          <FormGroup>
            <FormControlLabel control={<Checkbox checked={this.state.withChildren} onChange={(e) => this.setState({withChildren: e.target.checked})} id="c1"/>} label="With children"/>
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button type='submit'>Delete</Button>
          <Button onClick={() => this.handleClose(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>        
    )
  }
}

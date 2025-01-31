import { Close } from '@mui/icons-material'
import { AppBar, Box, Button, Dialog, DialogContent, Grid2, IconButton, TextField, Toolbar, Typography } from '@mui/material'
import React, { Component } from 'react'

export default class ValueDialog extends Component {
constructor(props) {
  super(props)

  this.state = {
     value: this.props.value,
     noChanges: true
     
  }
}

  render() {
    return (
      <Dialog
        open={this.props.open}
        fullScreen
      >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={(e) => this.props.cancelHandler()}
                >
                    <Close/>
                </IconButton>    
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">{this.props.title}</Typography>
                <Button 
                    autoFocus 
                    color="inherit" 
                    onClick={() => this.props.saveHandler(this.props.path, this.state.value) }
                    disabled={this.state.noChanges}
                >Save</Button>
            </Toolbar>
        </AppBar>

        <DialogContent dividers={true}>
            <TextField 
                fullWidth
                multiline
                defaultValue={this.props.value}
                onChange={(e) => this.setState({value: e.target.value, noChanges: false})}
            />

        </DialogContent>
      </Dialog>
    )
  }
}

import { Home, MoreHoriz } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid2, IconButton, Link, patch, TextField } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import React, { Component } from 'react'
import { isValidPathString, stringToPath } from './PathUtil';

export default class Navigator extends Component {

    constructor(props) {
        super(props);
        this.state = {pathInputDialog: false, invalidNewPath: false, newPathMessage: null};
        this.getFullPath = this.getFullPath.bind(this);
        this.openPathDialog = this.openPathDialog.bind(this);
        this.pathEntered = this.pathEntered.bind(this);
        this.validateNewPath = this.validateNewPath.bind(this);
    }


    onPathItemClick(node, i) {
        var res = this.getPath(i);
        console.debug(node, i, res);
        this.props.onQueryLevel(res);
    }

    openPathDialog() {
        var pathText = this.getPathText();
        this.setState({pathInputDialog: true, pathAsText: pathText});
    }

    pathEntered(pathString) { 
        const path = stringToPath(pathString);
        this.props.onQueryLevel(path);

    }

    validateNewPath(event) { 
        if (isValidPathString(event.target.value)) {
            this.setState({invalidNewPath: false, newPathMessage: null});
        } else {
            this.setState({invalidNewPath: true, newPathMessage: 'Invalid path value'});
        }

    }

  render() {
    
    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={1}>
                    <Grid2 size="grow">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                underline="hover"
                                sx={{ display: 'flex', alignItems: 'center' }}
                                color="inherit"
                                href="#/" 
                                onClick={() => this.onPathItemClick(null, -1)}>
                                    <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                            </Link>

                            {this.props.path.map((node, i) => 
                                <Link href={this.getFullPath(i)} 
                                    onClick={() => this.onPathItemClick(node, i)}>{node}</Link>)}

                        </Breadcrumbs>
                    </Grid2>

                    <Grid2 size='auto'>
                        <IconButton color="primary" aria-label="Enter path" onClick={() => this.openPathDialog()}>
                            <MoreHoriz/>
                        </IconButton>
                    </Grid2>
                </Grid2>
            </Box>

            <Dialog
                open={this.state.pathInputDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const newPath = formJson.pathAsText;
                        this.setState({pathInputDialog: false});
                        this.pathEntered(newPath);
                      },
                  }}
                >
            
                <DialogTitle>Enter path</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Enter path to go. Patch must be divided by slash char and start from slash char, for example /config/service1 
                    </DialogContentText>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="pathAsText"
                        label="Path"
                        fullWidth
                        onChange={e => this.validateNewPath(e)}
                        error={this.state.invalidNewPath}
                        helperText={this.state.newPathMessage}
                        variant="standard"
                        defaultValue={this.state.pathAsText}
                      />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">OK</Button>
                    <Button onClick={() => this.setState({pathInputDialog: false})}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
  }

  getFullPath(idx) {
    var result = '#';
    for(var i =0; i <= idx; i++) {
        result += '/' + this.props.path[i];
    }
    return result;
  }

  getPath(idx) {
    return this.props.path.slice(0, idx + 1);
  }

  getPathText() {
    return '/' + this.props.path.join('/');

  }
}

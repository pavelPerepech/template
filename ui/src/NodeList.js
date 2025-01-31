import { Add, AddCircle, ArrowCircleDown, ArrowCircleUp, Create, CreateRounded, CreateSharp, Edit, NewReleases, RemoveCircle } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid2, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import React, { Component } from 'react'
import { concatPaths, getParentPath, isValidPathString, stringToPath } from './PathUtil';
import { red } from '@mui/material/colors';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ValueDialog from './ValueDialog';

export default class NodeList extends Component {

    constructor(props) {
        super(props);
        this.state = {pathEnterDialog: false, invalidNewPath: false, newPathMessage: null, confirmDeleteOpen: false};
        this.onNodeEnterClick = this.onNodeEnterClick.bind(this);
        this.onNodeSelect = this.onNodeSelect.bind(this);
        this.validateNewPath = this.validateNewPath.bind(this);
        this.queryNewNode = this.queryNewNode.bind(this);
        this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }


    onNodeEnterClick(e, key) {
        e.stopPropagation(); 
        var newLevel = this.props.path.slice();
        if (key == undefined) {
            newLevel = getParentPath(newLevel);
        } else {
            newLevel.push(key);
        }
        
        console.debug(newLevel)
        this.props.onQueryLevel(newLevel);
    }
    
    onNodeSelect(key) {
        this.setState({current: key})
        let selectedPath = this.props.path.length > 0 ? this.props.path.slice(): [];
        selectedPath.push(key);
        console.debug("SELECTED>>>>", selectedPath)
        this.props.onCurrentKeyChange(key);
    }

    validateNewPath(event) {
        if (isValidPathString(event.target.value)) {
            this.setState({invalidNewPath: false, newPathMessage: null});
        } else {
            this.setState({invalidNewPath: true, newPathMessage: 'Invalid path value'});
        }

    }

    queryNewNode(newPath) {
        const newNodePath = stringToPath(newPath);
        const newFullPath = concatPaths(this.props.path,  newNodePath);
        this.setState({pathEnterDialog: false, invalidNewPath: false, newPathMessage: null});
        this.props.onQueyNewNode(newFullPath);
    }

    handleCloseDeleteDialog(isOk, withChildren) {
        if (isOk) {
            var deletePath = this.props.path.slice();
            deletePath.push(this.props.current);
            this.setState({confirmDeleteOpen: false});
            this.props.onDelete(deletePath, withChildren);
        } else {
            this.setState({confirmDeleteOpen: false});
        }
    }

    handleEdit() {
       this.props.onStartEditValue();

    }

  render() {
    return (
        <React.Fragment>
            <Grid2
                sx={{width: 1, height: 1}}
                columns={1} 
                container={true}
                direction={'column'}>
                <Grid2 size={'auto'}>
                    <div>
                    <Tooltip title="Create node or path">
                        <IconButton 
                            aria-level="create" 
                            disabled={false}
                            onClick={() => this.setState({pathEnterDialog: true})}
                        >
                            <AddCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete current node">
                        <IconButton 
                            aria-level="delete" 
                            disabled={this.state.current == null}
                            onClick={() => this.setState({confirmDeleteOpen: true})}
                        >
                            <RemoveCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit current node value">
                        <IconButton 
                            aria-level="edit" 
                            disabled={this.state.current == null}
                            onClick={() => this.handleEdit()}
                        >

                            <Edit />
                        </IconButton>
                    </Tooltip>
                    </div>
                </Grid2>

                <Grid2 size={'grow'} sx={{overflow: 'auto'}}>
                    <TableContainer component={Paper} sx={{height: 1}}>
                        <Table sx={{width: '100%'}} size="small">
                            <TableHead></TableHead>
                            <TableBody sx={{overflow: 'auto'}}>
                                {this.props.path.length != 0 && 
                                    <TableRow 
                                        key={'..'}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{width: '20px'}}><Link onClick={(e) => this.onNodeEnterClick(e)}><ArrowCircleUp sx={{ mr: 0.5, cursor: 'pointer' }} fontSize="small" /></Link></TableCell>
                                        <TableCell><Link  onClick={(e) => this.onNodeEnterClick(e)}>..</Link></TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>
                                }
                                {this.props.nodes.map((node) => 
                                    <TableRow 
                                        hover
                                        selected={this.props.current == node.key}
                                        onClick={(e) => this.onNodeSelect(node.key)}
                                        key={node.key}
                                    >
                                            <TableCell sx={{width: '20px'}}>
                                                {node['hasChildren'] &&
                                                    <Link onClick={(e) => this.onNodeEnterClick(e, node.key)}><ArrowCircleDown sx={{ mr: 0.5, cursor: 'pointer' }} fontSize="small"/></Link>
                                                }
                                                </TableCell>
                                            <TableCell><Link></Link>{node.key}</TableCell>
                                            <TableCell>{node.preview}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>            
            </Grid2>
            <Dialog
                open={this.state.pathEnterDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const newPath = formJson.pathAsText;
                        this.setState({pathInputDialog: false});
                        this.queryNewNode(newPath);
                      },
                  }}
                >
            
                <DialogTitle>Create new node or path</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Enter path to create node or nodes. Patch must be divided by slash char and start from slash char, for example /logging/level 
                    </DialogContentText>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="pathAsText"
                        label="Path"
                        fullWidth
                        error={this.state.invalidNewPath}
                        helperText={this.state.newPathMessage}
                        variant="standard"
                        defaultValue={this.state.pathAsText}
                        onChange={(event) => this.validateNewPath(event) }
                      />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">OK</Button>
                    <Button onClick={() => this.setState({pathEnterDialog: false})}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDeleteDialog 
                open={this.state.confirmDeleteOpen}
                node={this.props.current}
                onClose={this.handleCloseDeleteDialog}
            />
        </React.Fragment>
    )
  }
}

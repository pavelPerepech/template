import { Backdrop, Box, Button, CircularProgress, Grid2, IconButton, Snackbar, TextareaAutosize, TextField } from '@mui/material';
import React, { Component } from 'react'
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import NodeList from './NodeList';
import Navigator from './Navigator';
import { extractPathFromUrl, getParentPath, pathToString, pathToUrlSubPath } from './PathUtil';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { wait } from '@testing-library/user-event/dist/utils';
import { Close } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ValueViewer from './ValueViewer';
import { blue, green, red } from '@mui/material/colors';
import ValueDialog from './ValueDialog';
import { getBusinessErrorText, isFethResultOk, jsonResponse } from './FetchUtil';

export default class Data extends Component {

    constructor(props) {
        super(props);

        this.state = {
            split: [600, 'auto'],
            wait: false,
            path: [],
            currentPath: [],
            initialized: false,
            nodes: [],
            queryError: '',
            errorVisible: false,
            selectedValue: '',
            selectedKey: null,
            valueEditorOpen: false
        }

        this.applySplitPosition = this.applySplitPosition.bind(this);
        this.queryLevelInfo = this.queryLevelInfo.bind(this);
        this.hideError = this.hideError.bind(this);
        this.queryValue = this.queryValue.bind(this);
        this.queryNewNode = this.queryNewNode.bind(this);
        this.onCurrentKeyChange = this.onCurrentKeyChange.bind(this);
        this.handleDeletePath = this.handleDeletePath.bind(this);
        this.handleStartEditValue = this.handleStartEditValue.bind(this);
        this.handleSaveEditValue = this.handleSaveEditValue.bind(this);
    }

  applySplitPosition(sizes) {
    this.setState({split: sizes});
  }  
  
  queryLevelInfo(newPath, selectedKey) {
    this.setState({wait: true});
   
    fetch("/api/data/info", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(newPath),

    }).then(response => {
        if (response.status < 400) {
            return response.json()
        } else {
            throw new Error("Error read level");
        }
    })
    .then((result) => {
        const anchor = '/#' + pathToString(newPath);
        this.setState({wait: false, nodes: result, path: newPath, selectedValue: '', selectedKey: selectedKey});
        window.location.href = anchor;
    }).catch(error => {
        console.log(error);
        this.setState({wait: false, errorVisible: true, queryError: error.message});
    })
  }

  queryValue(path) {
    const key = (path == undefined || path == null || path.length == 0) ? null: path.slice(path.length - 1);
    console.debug("Query value:", path)
    this.setState({wait: false})

    fetch("/api/data/string-value", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(path),

    }).then(response => {
        if (response.status < 400) {
            return response.json()
        } else {
            throw new Error("Error read value");
        }
    })
    .then((result) => {
        console.debug("Value query", result);     
        const nodes = this.state.nodes;
        if (key != null) {
            const node = nodes.find(n => n.key == key);
            if (node != null) {
                node.preview = result.preview;
            }
        }
        this.setState({wait: false, selectedValue: result.value, currentPath: path, nodes: nodes});
    }).catch(error => {
        console.log(error);
        this.setState({wait: false, errorVisible: true, queryError: error.message, selectedValue: ""});
    })
  }

  queryNewNode(newPath) {
    console.debug("Query create path", newPath);
    if (newPath == undefined || newPath == null || newPath.length == 0) {
        this.setState({errorVisible: true, queryError: 'Invalid path', selectedValue: ""});
        return;
    }
    const key = newPath.slice(newPath.length - 1);  

    this.setState({wait: false});
    fetch("/api/data", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(newPath),
    }).then(response => {
        if (response.status < 400) {
            return response.json()
        } else {
            throw new Error("Error create nodes");
        }
    })
    .then((result) => {
        console.debug("Create node result", result);
           
        var levelPath = getParentPath(result);
        this.queryLevelInfo(levelPath, key);
    }).catch(error => {
        console.log(error);
        this.setState({wait: false, errorVisible: true, queryError: error.message, selectedValue: ""});
    })
  }
 
  onCurrentKeyChange(key) {
    console.debug("KEY CHANGED", key)
    const selectedFullPath = this.state.path.slice();
    selectedFullPath.push(key);
    this.setState({selectedKey: key});
    this.queryValue(selectedFullPath);
  }


  handleDeletePath(path, withChildren) {
    this.setState({wait: true})
    fetch("/api/data", {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({path: path, withChildren: withChildren}),
    }).then(response => {
        var ct = response.headers.get('Content-Type');
        if (ct != 'application/json') {
            throw new Error("Error delete node");   
        }
        return response.json().then(payload => ({status: response.status, payload: payload}));
    })
    .then((result) => {
        console.debug("Delete node result", result.payload, result.status);
        
        if (result.status < 400) {
            var levelPath = getParentPath(result.payload);
            this.queryLevelInfo(levelPath);
        } else {
            this.setState({wait: false, queryError: result.payload.message, errorVisible: true});
        }
    }).catch(error => {
        console.log(error);
        this.setState({wait: false, errorVisible: true, queryError: error.message, selectedValue: ""});
    })

  }

  componentDidMount() { 
    let startPath = extractPathFromUrl(window.location.href);
    console.debug("LOC", window.location.href, startPath)
    this.queryLevelInfo(startPath);
  }

  hideError() {
    this.setState({errorVisible: false})
  }


  handleStartEditValue() {
    var path = this.state.currentPath.slice();
    const key = (path == undefined || path == null || path.length == 0) ? null: path.slice(path.length - 1);

    this.setState({wait: false});
    fetch("/api/data/string-value", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(path),

    }).then(response => {
       return jsonResponse(response, "Error query actual value");
    }).then(result => {
        const nodes = this.state.nodes;
        if (isFethResultOk(result)) {
            if (key != null) {
                const node = nodes.find(n => n.key == key);
                if (node != null) {
                    node.preview = result.payload.preview;
                }
            }
            this.setState({wait: false, queryError: null, errorVisible: false, selectedValue: result.payload.value, nodes: nodes, valueEditorOpen: true});
        } else {
            this.setState({wait: false, queryError: getBusinessErrorText(result, "Error query actual value"), errorVisible: true});
        }

    }).catch(error => {
        this.setState({wait: false, errorVisible: true, queryError: error.message});
    })
  }

  handleSaveEditValue(path, value) {
    console.debug("~~~~~~~SAVE", path, value);
    const requestBody = {path: path, value: value};
    this.setState({wait: false});
    fetch("/api/data/string-value", {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(requestBody),
    }).then(response => {
       return jsonResponse(response, "Error query actual value");
    }).then(result => {
        if (isFethResultOk(result)) {
            const path = result.payload.path;
            const key = (path == undefined || path == null || path.length == 0) ? null: path.slice(path.length - 1);
            const nodes = this.state.nodes;
            if (key != null) {
                const node = nodes.find(n => n.key == key);
                if (node != null) {
                    node.preview = result.payload.preview;
                }
            }
            this.setState({wait: false, queryError: null, errorVisible: false, valueEditorOpen: false, selectedValue: result.payload.value, nodes: nodes})
        } else {
            this.setState({wait: false, queryError: getBusinessErrorText(result, "Error save value"), errorVisible: true});
        }
    }).catch(error => {
        this.setState({wait: false, errorVisible: true, queryError: error.message});
    })

  }

  render() {
    const layoutCSS = {
        height: '100%',
        display: 'flex',
        alignItems: 'top',
        justifyContent: 'left'
      };

      const closeErrorSnack = (
        <React.Fragment>
          <Button color="secondary" size="small" onClick={() => this.hideError()}>
            CLOSE
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => this.hideError()}
          >
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      );  
    return (
        <React.Fragment>
            <Grid2 
                sx={{width: 1, height: 1}}
                columns={1} 
                container={true}
                direction={'column'}>
            <Grid2 
                size='auto'>
                <Navigator 
                    path={this.state.path}
                    onQueryLevel={this.queryLevelInfo}/>
            </Grid2>

            <Grid2 size='grow'>
            <SplitPane split='vertical' 
                        sizes={this.state.split}
                        onChange={this.applySplitPosition}>
                    <Pane minSize={300} maxSize='50%'>          
                        <NodeList
                            path={this.state.path}
                            nodes={this.state.nodes} 
                            onQueryLevel={this.queryLevelInfo}  
                            current={this.state.selectedKey}
                            onCurrentKeyChange={this.onCurrentKeyChange}
                            onQueyNewNode={(path) => this.queryNewNode(path)}
                            onDelete={this.handleDeletePath}
                            onStartEditValue={this.handleStartEditValue}
                        />
                    </Pane>

                    <ValueViewer 
                        value={this.state.selectedValue} 
                        path={this.state.currentPath}
                        refreshHandler={this.queryValue}
                        onStartEditValue={this.handleStartEditValue}
                    />        
                </SplitPane>
            </Grid2>
            <Snackbar 
                open={this.state.errorVisible}
                autoHideDuration={6000}
                onClose={() => this.hideError()}
                message={this.state.queryError}
                action={closeErrorSnack}
                />
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={this.state.wait}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            </Grid2> 
            <ValueDialog
                open={this.state.valueEditorOpen}
                value={this.state.selectedValue}
                title={pathToString(this.state.currentPath)}
                path={this.state.currentPath}
                cancelHandler={() => this.setState({valueEditorOpen: false})}
                saveHandler={this.handleSaveEditValue}
            />
        </React.Fragment>
    )
  }
}

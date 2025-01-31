import { Close, Edit, EditAttributes, EditRounded, ImportContacts, Refresh, RefreshRounded, RefreshSharp, Share, ShowChart } from '@mui/icons-material';
import { AppBar, Box, Button, Dialog, FormControl, Grid2, IconButton, InputLabel, MenuItem, Select, Slide, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { pathToString } from './PathUtil';

export default class ValueViewer extends Component {

    constructor(props) {
        super(props);    
        this.state = {format: 'text', edit: false}
        this.formatChanged = this.formatChanged.bind(this);
        this.onRefreshAction = this.onRefreshAction.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onSpeedDialClose = this.onSpeedDialClose.bind(this);
    }

    formatChanged(event) {
        this.setState({format: event.target.value})
    }


    onRefreshAction(event) {
        this.props.refreshHandler(this.props.path);
    }

    onSpeedDialClose(event) {
        console.debug(event);
    }


    closeEdit(event) {
        this.setState({edit: false})
    }

    render() {
        const layoutCSS = {
            height: '100%',
//            display: 'flex',
            overflow: 'auto',
            alignItems: 'top',
            justifyContent: 'left'
        };

    

        return (
            <Grid2 
                sx={{width: 1, height: 1}}
                columns={1}
                direction={'column'}
                container={true}>
                    <Grid2 size={'auto'}>
                        <ToggleButtonGroup
                            color="primary"
                            exclusive
                            aria-label='format'
                            value={this.state.format}
                            onChange={this.formatChanged}
                        >
                            <ToggleButton value="text">Plain text</ToggleButton>
                            <ToggleButton value="xml">XML</ToggleButton>
                            <ToggleButton value="json">JSON</ToggleButton>
                            <ToggleButton value="yaml">YAML</ToggleButton>
                            <ToggleButton value="grovy">Groovy</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid2>

                    <Grid2 size={'grow'}>
                        <div style={{ ...layoutCSS }}>
                            <SyntaxHighlighter sx={{with: 1, height: 1}} language={this.state.format}>{this.props.value}
                            </SyntaxHighlighter>
                        </div>
                    
                       
                    </Grid2>

                    <SpeedDial
                            ariaLabel='Value actions'
                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
                            icon={<SpeedDialIcon />} 

                    >
                        <SpeedDialAction 
                            key={'refresh'}
                            icon={<RefreshRounded/>}
                            tooltipTitle={'Refresh current value'}
                            onClick={(e) => this.onRefreshAction(e)}
                        />
                        <SpeedDialAction 
                            key={'edit'}
                            icon={<EditRounded/>}
                            tooltipTitle={'Edit current value'}
                            onClick={this.props.onStartEditValue}
                        />
                    </SpeedDial>
            </Grid2>
        )
    }
}

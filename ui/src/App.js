import './App.css';
import { AppBar, Backdrop, Box, CircularProgress, Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Data from './Data';
import { useEffect, useState } from 'react';
import { blue, green, yellow } from '@mui/material/colors';


function App() {
  const [caption, setCaption] = useState("Zoo");
  const [wait, setWait] = useState(false);
  const [infoError, setInfoError] = useState('');

  useEffect(() => {
    const fetchCaption = async () => {
      try {
        const response = await fetch('/api/info/about');
        const result = await response.json();
        setCaption(result['caption']);
        setWait(false);
        setInfoError('');
      } catch (error) {
        setWait(false);
        setInfoError('Error queri initializing data... Reload this page later...');
        console.error("ERROR", error);
      }
    };

    setWait(true);
    fetchCaption();
  }, []);

  return (

    <Grid2 
      sx={{width: 1, height: 1}}
      columns={1}
      direction={'column'}
      container={true}
      >
 
      <Grid2 size={'auto'}>  
        <AppBar position='static'>
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon/>
            </IconButton>

            <Typography variant="h6" color="inherit" component="div">{caption}</Typography>
          </Toolbar>
        </AppBar>
      </Grid2>

     <Grid2 size={'grow'} sx={{backgroundColor: green}}>
      <Data/>
     </Grid2>

     <Backdrop 
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={wait}>
          <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop 
        sx={(theme) => ({ color: '#f55', zIndex: theme.zIndex.drawer + 1 })}
        open={infoError != ''}>
          <Typography variant="h6" color="inherit" component="div">{infoError}</Typography>
        </Backdrop>
    
     
     </Grid2>
  );
}

export default App;

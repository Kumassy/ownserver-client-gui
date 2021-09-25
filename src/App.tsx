import React, { useEffect } from 'react'
import './App.css'
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'
import { useAppSelector, useAppDispatch } from './app/hooks'
import { ClientInfo, updateClientInfo } from './features/tunnelSlice'
import { receiveMessage, runChecks } from './features/localSlice'
import { LocalMessage } from './data'

import { styled } from '@mui/material/styles';
import { SelectChangeEvent } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';


import AutoScroll from '@brianmcallister/react-auto-scroll';
import { StepLauchLocalServer, StepSelectGame, StepLaunchTunnel, StepMonitoring, StepContent } from './Steps'

function invokeCommand() {
  invoke('long_running_command').then((message) => console.log(message))
}

function emitCancelCommand() {
  emit('cancel_command');
}

function isLocalMessage(arg: any): arg is LocalMessage {
  return 'message' in arg;
}

function isClientInfo(arg: any): arg is ClientInfo {
  return 'client_id' in arg && 'remote_addr' in arg
}

const steps = [
  'Select game',
  'Launch local server',
  'Configure proxy',
  'Monitor'
];

function App() {
  const dispatch = useAppDispatch()
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    const f = async () => {
      const unlisten = await listen('local_server_message', event => {
        console.log(event.payload);
        if (isLocalMessage(event.payload)) {
          const message = event.payload.message;
          console.log(`got ${event.event} ${JSON.stringify(message)}`);
          dispatch(receiveMessage(message));
        }
      })
      return unlisten
    }
    f()
  }, []);

  useEffect(() => {
    const f = async () => {
      const unlisten = await listen('update_client_info', event => {
        console.log(event.payload);
        if (isClientInfo(event.payload)) {
          const clientInfo = event.payload;
          console.log(`got ${event.event} ${JSON.stringify(clientInfo)}`);
          dispatch(updateClientInfo(clientInfo));
        }
      })
      return unlisten
    }
    f()
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Magic Tunnel Client
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stepper activeStep={activeStep} sx={{ padding: 2 }}>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
          <StepContent
            step={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            handleReset={handleReset}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default App

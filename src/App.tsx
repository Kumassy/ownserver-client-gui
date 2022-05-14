import React, { useEffect } from 'react'
import './App.css'
import { listen } from '@tauri-apps/api/event'
import { useAppDispatch } from './app/hooks'
import { ClientInfo, updateClientInfo } from './features/tunnelSlice'
import { receiveMessage } from './features/localSlice'
import { LocalMessage } from './data'

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


import { StepContent } from './Steps'

function isLocalMessage(arg: any): arg is LocalMessage {
  return 'message' in arg;
}

function isClientInfo(arg: any): arg is ClientInfo {
  return 'client_id' in arg && 'remote_addr' in arg
}

const steps = [
  'ゲーム選択',
  'ゲームサーバーの起動',
  'OwnServerの設定',
  'サーバー管理'
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
  }, [dispatch]);

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
  }, [dispatch]);

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

import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { listen } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/shell';
import { useAppDispatch } from './app/hooks'
import { ClientInfo, updateClientInfo } from './features/tunnelSlice'
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

import { StepContent } from './steps'
import { Button, ButtonGroup, Drawer, Grid, InputLabel, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { AppType, constructUrl, Game } from './inquiry';

function isClientInfo(arg: any): arg is ClientInfo {
  return 'client_id' in arg && 'remote_addr' in arg
}

const steps = [
  'panel.startServer.stepper.selectGame',
  'panel.startServer.stepper.launchLocalServer',
  'panel.startServer.stepper.configureOwnServer',
  'panel.startServer.stepper.monitor'
];

const drawerWidth = 240;

function App() {
  const dispatch = useAppDispatch()
  const [activeStep, setActiveStep] = React.useState(0);
  const [panel, setPanel] = useState<'startServer' | 'settings' | 'inquiry'>('startServer');
  const [lang, setLang] = useState<'en-US' | 'ja-JP' | null>(null);
  const { t, i18n } = useTranslation();


  const unlistenRef = useRef<() => void>();
  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen('update_client_info', event => {
        console.log(event.payload);
        if (isClientInfo(event.payload)) {
          const clientInfo = event.payload;
          console.log(`got ${event.event} ${JSON.stringify(clientInfo)}`);
          dispatch(updateClientInfo(clientInfo));
        }
      })
      unlistenRef.current = unlisten;
    }

    setupListener()

    return () => {
      if (unlistenRef.current) {
        unlistenRef.current()
      }
    }
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

  const handleFormButtonClick = async () => {
    const url = constructUrl(Game.MinecraftForge, 'Windows', AppType.GUI, '0.1.0', 'test');
    await open(url);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setPanel('startServer')}>
              <ListItemIcon>
                <PlayCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t('menu.startServer')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setPanel('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('menu.settings')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setPanel('inquiry')}>
              <ListItemIcon>
                <ContactSupportIcon />
              </ListItemIcon>
              <ListItemText primary={t('menu.inquiry')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {panel === 'startServer' &&
        <Box sx={{ minHeight: '100vh', width: `calc(100vw - ${drawerWidth}px)`, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Stepper activeStep={activeStep} sx={{ padding: 2 }}>
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel>{t(label)}</StepLabel>
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
      }
      {panel === 'settings' &&
        <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <InputLabel id="select-lang-label">{t('panel.settings.selectLanguage')}</InputLabel>
              <Select
                labelId="select-lang-label"
                id="select-lang"
                value={lang ? lang : i18n.language as 'en-US' | 'ja-JP'}
                label="Language"
                onChange={(e: SelectChangeEvent<'en-US' | 'ja-JP'>) => {
                  const lang = e.target.value as 'en-US' | 'ja-JP'
                  setLang(lang)
                  i18n.changeLanguage(lang)
                }}
              >
                <MenuItem value={'en-US'}>{t('lang.en')}</MenuItem>
                <MenuItem value={'ja-JP'}>{t('lang.ja')}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
      }
      {panel === 'inquiry' &&
        <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography sx={{ mb: 2 }} variant="h6" component="div">
                {t('panel.inquiry.title')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Typography>{t('panel.inquiry.description1')}</Typography>
              <Typography>{t('panel.inquiry.description2')}</Typography>
              <Link href="https://google.com" target="_blank">
                {t('panel.inquiry.linkText')}
              </Link>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <ButtonGroup
                orientation="vertical"
                aria-label="Vertical button group"
                variant="contained"
              >
                <Button variant="contained" onClick={handleFormButtonClick}>
                  {t('panel.inquiry.formButtonText')}
                </Button>
                <Button variant="contained" href="https://google.com" target="_blank">
                  {t('panel.inquiry.mashmallowButtonText')}
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Box>
      }
    </Box>
  )
}

export default App

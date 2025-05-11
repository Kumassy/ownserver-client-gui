import React, { useEffect, useRef } from 'react';
import { updateCommand, updateFilepath, updateLocalPort, setAcceptEula } from '../features/reducers/games/minecraftForge';
import { killChild, runChecksAndLaunchLocal } from '../features/localSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import { open } from '@tauri-apps/plugin-dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AutoScroll from '@brianmcallister/react-auto-scroll';
import Stack from '@mui/material/Stack';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { listen } from '@tauri-apps/api/event';
import { FormProps } from '../types';
import { OperationButton, ResultChip } from '../utils';

export const FormMinecraftForge: React.FC<FormProps> = ({ handleBack, handleNext }) => {
  const localMessages = useAppSelector(state => state.local.messages)
  const localStatus = useAppSelector(state => state.local.status)
  const localPort = useAppSelector(state => state.local.config.minecraft_forge.endpoints[0].port)
  const command = useAppSelector(state => state.local.config.minecraft_forge.command)
  const checks = useAppSelector(state => state.local.checks)
  const filepath = useAppSelector(state => state.local.config.minecraft_forge.filepath)
  const eulaChecked = useAppSelector(state => state.local.config.minecraft_forge.acceptEula)
  const { t } = useTranslation();
  const dispatch = useAppDispatch()

  const isBackDisabled = localStatus === 'running'
  const isNextDisabled = localStatus !== 'running'
  const isOperationButtonDisabled = filepath == null || eulaChecked === false


  const unlistenRef = useRef<() => void>(null);
  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen<Array<string>>('tauri://file-drop', event => {
        if (event.payload.length === 1) {
          let file = event.payload[0];
          dispatch(updateFilepath(file))
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

  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          {t('panel.startServer.steps.launchLocalServer.minecraft_forge.settings.label')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2}}>
          <Button
            variant="contained"
            onClick={async () => {
              const file = await open({
                multiple: false,
                filters: [{
                  name: 'script',
                  extensions: ['sh', 'bat']
                }]
              });

              if (typeof file === 'string') {
                dispatch(updateFilepath(file))
              }
            }}
          >
            {t('panel.startServer.steps.launchLocalServer.minecraft_forge.settings.file')}
          </Button>
          {filepath == null?
            <Typography>{t('panel.startServer.steps.launchLocalServer.minecraft_forge.settings.fileDesc')}</Typography>
          : <Typography>{filepath}</Typography>}

        </Stack>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={eulaChecked}
                onChange={(e) => dispatch(setAcceptEula(e.target.checked))} />
            }
            label={t('panel.startServer.steps.launchLocalServer.minecraft_forge.settings.eula')} />
          <FormHelperText>{t('panel.startServer.steps.launchLocalServer.minecraft_forge.settings.eulaDesc')}</FormHelperText>
        </FormGroup>


        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{t('panel.startServer.steps.launchLocalServer.minecraft_forge.advancedSettings.label')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id="local-server-command"
              label={t('panel.startServer.steps.launchLocalServer.minecraft_forge.advancedSettings.command')}
              variant="outlined"
              onChange={e => dispatch(updateCommand(e.target.value))}
              value={command}
            />
            <TextField
              fullWidth
              id="local-port"
              label={t('panel.startServer.steps.launchLocalServer.minecraft_forge.advancedSettings.port')}
              type="number"
              variant="outlined"
              onChange={e => dispatch(updateLocalPort(parseInt(e.target.value)))}
              value={localPort}
            />
          </AccordionDetails>
        </Accordion>





        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{xs: 12}}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              {t('panel.startServer.steps.launchLocalServer.minecraft_forge.tasks.label')}
            </Typography>

            {checks.map(check => {
              return (
                <Accordion key={check.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>{t(`panel.startServer.checks.${check.label}`)} <ResultChip status={check.status} /></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {check.message}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )
            })}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{t('panel.startServer.steps.launchLocalServer.minecraft_forge.tasks.start')} <ResultChip status={localStatus} /></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AutoScroll
                  showOption={false}
                  height={100}
                >
                  {localMessages.map(msg => {
                    return (
                      <div key={msg.key}>
                        {msg.message}
                      </div>
                    );
                  })}
                </AutoScroll>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid>
            <Tooltip title={isOperationButtonDisabled ? t('panel.startServer.steps.launchLocalServer.minecraft_forge.control.operationDesc'): ""}>
              <span>
                <OperationButton
                  status={localStatus}
                  disabled={isOperationButtonDisabled}
                  launch={runChecksAndLaunchLocal}
                  interrupt={killChild}
                />
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Tooltip title={isBackDisabled ? t('panel.startServer.steps.launchLocalServer.minecraft_forge.control.backDesc'): ""}>
          <span>
            <Button
              color="inherit"
              disabled={isBackDisabled}
              onClick={handleBack}
            >
              {t('common.control.back')}
            </Button>
          </span>
        </Tooltip>
        <Box sx={{ flex: '1 1 auto' }} />

        <Tooltip title={isNextDisabled ? t('panel.startServer.steps.launchLocalServer.minecraft_forge.control.nextDesc'): ""}>
          <span>
            <Button
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {t('common.control.next')}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </React.Fragment>
  )
}

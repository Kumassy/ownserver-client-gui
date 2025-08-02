import React, { useEffect, useRef } from 'react';
import { updateCommand, updateFilepath, updateLocalPort, setAcceptEula } from '../features/reducers/games/minecraftForge';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import { open } from '@tauri-apps/plugin-dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Stack from '@mui/material/Stack';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { listen } from '@tauri-apps/api/event';
import { FormProps } from '../types';
import { GameTaskSection } from './components/GameTaskSection';
import { FormFooter } from './components/FormFooter';

export const FormMinecraftForge: React.FC<FormProps> = ({ handleBack, handleNext }) => {
  const localStatus = useAppSelector(state => state.local.status);
  const localPort = useAppSelector(state => state.local.config.minecraft_forge.endpoints[0].port);
  const command = useAppSelector(state => state.local.config.minecraft_forge.command);
  const filepath = useAppSelector(state => state.local.config.minecraft_forge.filepath);
  const eulaChecked = useAppSelector(state => state.local.config.minecraft_forge.acceptEula);
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





        <GameTaskSection gameKey="minecraft_forge" isOperationButtonDisabled={isOperationButtonDisabled} />
      </Box>

      <FormFooter
        gameKey="minecraft_forge"
        handleBack={handleBack}
        handleNext={handleNext}
        isBackDisabled={isBackDisabled}
        isNextDisabled={isNextDisabled}
      />
    </React.Fragment>
  )
}

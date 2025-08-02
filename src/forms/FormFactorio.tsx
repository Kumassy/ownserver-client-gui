import React from 'react';
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
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormProps } from '../types';
import { updateCommand, updateFilepath, updateLocalPort } from '../features/reducers/games/factorio';
import { GameTaskSection } from './components/GameTaskSection';
import { FormFooter } from './components/FormFooter';

export const FormFactorio: React.FC<FormProps> = ({ handleBack, handleNext }) => {
  const localStatus = useAppSelector(state => state.local.status);
  const localPort = useAppSelector(state => state.local.config.factorio.endpoints[0].port);
  const command = useAppSelector(state => state.local.config.factorio.command);
  const filepath = useAppSelector(state => state.local.config.factorio.savepath);
  const { t } = useTranslation();
  const dispatch = useAppDispatch()

  const isBackDisabled = localStatus === 'running'
  const isNextDisabled = localStatus !== 'running'
  const isOperationButtonDisabled = filepath == null
  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          {t('panel.startServer.steps.launchLocalServer.factorio.settings.label')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2}}>
          <Tooltip title={t('panel.startServer.steps.launchLocalServer.factorio.settings.folderDesc')}>
            <Button
              variant="contained"
              onClick={async () => {
                const filepath = await open({ multiple: false, directory: true });

                if (typeof filepath === 'string') {
                  dispatch(updateFilepath(filepath))
                }
              }}
            >
              {t('panel.startServer.steps.launchLocalServer.factorio.settings.folder')}
            </Button>
          </Tooltip>
          <Typography>{filepath}</Typography>
        </Stack>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{t('panel.startServer.steps.launchLocalServer.factorio.advancedSettings.label')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id="local-server-command"
              label={t('panel.startServer.steps.launchLocalServer.factorio.advancedSettings.command')}
              variant="outlined"
              onChange={e => dispatch(updateCommand(e.target.value))}
              value={command}
            />
            <TextField
              fullWidth
              id="local-port"
              label={t('panel.startServer.steps.launchLocalServer.factorio.advancedSettings.port')}
              type="number"
              variant="outlined"
              onChange={e => dispatch(updateLocalPort(parseInt(e.target.value)))}
              value={localPort}
            />
          </AccordionDetails>
        </Accordion>





        <GameTaskSection gameKey="factorio" isOperationButtonDisabled={isOperationButtonDisabled} />
      </Box>

      <FormFooter
        gameKey="factorio"
        handleBack={handleBack}
        handleNext={handleNext}
        isBackDisabled={isBackDisabled}
        isNextDisabled={isNextDisabled}
      />
    </React.Fragment>
  )
}

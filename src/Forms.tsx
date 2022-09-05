import React, { useState } from 'react'
import { killChild, updateCommand, updateFilepath,  updateLocalPort, runChecksAndLaunchLocal, updateProtocol } from './features/localSlice'
import { useAppSelector, useAppDispatch } from './app/hooks'

import { open } from '@tauri-apps/api/dialog'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';

import AutoScroll from '@brianmcallister/react-auto-scroll';
import Stack from '@mui/material/Stack';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { Protocol } from './common';
import { useTranslation } from 'react-i18next';

export type FormProps = {
  handleNext: () => void,
  handleBack: () => void,
}

export type OperationButtonProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  disabled?: boolean
  launch: any
  interrupt: any
}

export const OperationButton: React.VFC<OperationButtonProps> = ({ status, disabled, launch, interrupt }) => {
  const dispatch = useAppDispatch()
  const { t, i18n } = useTranslation();

  switch (status) {
    case 'idle':
    case 'succeeded':
    case 'failed':
      return (
        <Button
          variant="contained"
          disabled={disabled}
          onClick={() => dispatch(launch())}
        >
          {t('common.control.start')}
        </Button>
      )
    case 'running':
      return (
        <Button
          variant="contained"
          disabled={disabled}
          onClick={() => dispatch(interrupt())}
        >
          {t('common.control.stop')}
        </Button>
      )
  }
}

type ResultChipProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
}

export const ResultChip: React.VFC<ResultChipProps> = ({ status }) => {
  const { t, i18n } = useTranslation();

  switch (status) {
    case 'idle':
      return (
        <React.Fragment></React.Fragment>
      )
    case 'running':
      return (
        <Chip label={t('common.result.running')} color="info" />
      )
    case 'succeeded':
      return (
        <Chip label={t('common.result.succeeded')} color="success" />
      )
    case 'failed':
      return (
        <Chip label={t('common.result.failed')} color="error" />
      )
  }
}

export const FormMinecraft: React.VFC<FormProps> = ({ handleBack, handleNext }) => {
  const localMessages = useAppSelector(state => state.local.messages)
  const localStatus = useAppSelector(state => state.local.status)
  const localPort = useAppSelector(state => state.local.port)
  const command = useAppSelector(state => state.local.command)
  const checks = useAppSelector(state => state.local.checks)
  const { t, i18n } = useTranslation();
  const filepath = useAppSelector(state => 'filepath' in state.local.config ? state.local.config.filepath : t('panel.startServer.steps.launchLocalServer.minecraft.errors.filepath'))
  const dispatch = useAppDispatch()
  const [ eulaChecked, setEulaChecked ] = useState(false)

  const isBackDisabled = localStatus === 'running'
  const isNextDisabled = localStatus !== 'running'
  const isOperationButtonDisabled = filepath == null || eulaChecked === false

  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          {t('panel.startServer.steps.launchLocalServer.minecraft.settings.label')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2}}>
          <Button
            variant="contained"
            onClick={async () => {
              const file = await open({
                multiple: false,
                filters: [{
                  name: 'jar',
                  extensions: ['jar']
                }]
              });

              if (typeof file === 'string') {
                dispatch(updateFilepath(file))
              }
            }}
          >
            {t('panel.startServer.steps.launchLocalServer.minecraft.settings.file')}
          </Button>
          <Typography>{filepath}</Typography>
        </Stack>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                value={eulaChecked}
                onChange={(e) => setEulaChecked(e.target.checked)} />
            }
            label={t('panel.startServer.steps.launchLocalServer.minecraft.settings.eula')} />
          <FormHelperText>{t('panel.startServer.steps.launchLocalServer.minecraft.settings.eulaDesc')}</FormHelperText>
        </FormGroup>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{t('panel.startServer.steps.launchLocalServer.minecraft.advancedSettings.label')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id="local-server-command"
              label={t('panel.startServer.steps.launchLocalServer.minecraft.advancedSettings.command')}
              variant="outlined"
              onChange={e => dispatch(updateCommand(e.target.value))}
              value={command}
            />
            <TextField
              fullWidth
              id="local-port"
              label={t('panel.startServer.steps.launchLocalServer.minecraft.advancedSettings.port')}
              type="number"
              variant="outlined"
              onChange={e => dispatch(updateLocalPort(parseInt(e.target.value)))}
              value={localPort}
            />
          </AccordionDetails>
        </Accordion>





        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              {t('panel.startServer.steps.launchLocalServer.minecraft.tasks.label')}
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
                <Typography>{t('panel.startServer.steps.launchLocalServer.minecraft.tasks.start')} <ResultChip status={localStatus} /></Typography>
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
          <Grid item xs={12}>
            <Tooltip title={isOperationButtonDisabled ? t('panel.startServer.steps.launchLocalServer.minecraft.control.operationDesc'): ""}>
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
        <Tooltip title={isBackDisabled ? t('panel.startServer.steps.launchLocalServer.minecraft.control.backDesc'): ""}>
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

        <Tooltip title={isNextDisabled ? t('panel.startServer.steps.launchLocalServer.minecraft.control.nextDesc'): ""}>
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


export const FormFactorio: React.VFC<FormProps> = ({ handleBack, handleNext }) => {
  const localMessages = useAppSelector(state => state.local.messages)
  const localStatus = useAppSelector(state => state.local.status)
  const localPort = useAppSelector(state => state.local.port)
  const command = useAppSelector(state => state.local.command)
  const checks = useAppSelector(state => state.local.checks)
  const { t, i18n } = useTranslation();
  const filepath = useAppSelector(state => 'savepath' in state.local.config ? state.local.config.savepath : t('panel.startServer.steps.launchLocalServer.factorio.errors.savepath'))
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
                const file = await open({ multiple: false, directory: true });

                if (typeof file === 'string') {
                  dispatch(updateFilepath(file))
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





        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              {t('panel.startServer.steps.launchLocalServer.factorio.tasks.label')}
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
                <Typography>{t('panel.startServer.steps.launchLocalServer.factorio.tasks.start')} <ResultChip status={localStatus} /></Typography>
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
          <Grid item xs={12}>
            <Tooltip title={isOperationButtonDisabled ? t('panel.startServer.steps.launchLocalServer.factorio.control.operationDesc'): ""}>
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
        <Tooltip title={isBackDisabled ? t('panel.startServer.steps.launchLocalServer.factorio.control.backDesc'): ""}>
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

        <Tooltip title={isNextDisabled ? t('panel.startServer.steps.launchLocalServer.factorio.control.nextDesc'): ""}>
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

export const FormCustom: React.VFC<FormProps> = ({ handleBack, handleNext }) => {
  const localMessages = useAppSelector(state => state.local.messages)
  const localPort = useAppSelector(state => state.local.port)
  const localStatus = useAppSelector(state => state.local.status)
  const checks = useAppSelector(state => state.local.checks)
  const command = useAppSelector(state => state.local.command)
  const protocol = useAppSelector(state => state.local.protocol)
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch()

  const isBackDisabled = localStatus === 'running'
  const isNextDisabled = localStatus !== 'running'
  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          {t('panel.startServer.steps.launchLocalServer.custom.settings.label')}
        </Typography>

        <TextField
          fullWidth
          id="local-server-command"
          label={t('panel.startServer.steps.launchLocalServer.custom.settings.command')}
          variant="outlined"
          onChange={e => dispatch(updateCommand(e.target.value))}
          value={command ? command : ''}
        />
        <TextField
          fullWidth
          id="local-port"
          label={t('panel.startServer.steps.launchLocalServer.custom.settings.port')}
          type="number"
          variant="outlined"
          onChange={e => dispatch(updateLocalPort(parseInt(e.target.value)))}
          value={localPort}
        />

        <InputLabel id="select-protocol-label">{t('panel.startServer.steps.launchLocalServer.custom.settings.protocol.label')}</InputLabel>
        <Select
          labelId="select-protocol-label"
          id="select-protocol"
          value={protocol}
          label={t('panel.startServer.steps.launchLocalServer.custom.settings.protocol.label')}
          onChange={(e: SelectChangeEvent<Protocol>) => dispatch(updateProtocol(e.target.value as Protocol))}
        >
          <MenuItem value={'tcp'}>{t('panel.startServer.steps.launchLocalServer.custom.settings.protocol.tcp')}</MenuItem>
          <MenuItem value={'udp'}>{t('panel.startServer.steps.launchLocalServer.custom.settings.protocol.udp')}</MenuItem>
        </Select>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              {t('panel.startServer.steps.launchLocalServer.custom.tasks.label')}
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
                <Typography>{t('panel.startServer.steps.launchLocalServer.custom.tasks.start')} <ResultChip status={localStatus} /></Typography>
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
          <Grid item xs={12}>
            <OperationButton
              status={localStatus}
              launch={runChecksAndLaunchLocal}
              interrupt={killChild}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Tooltip title={isBackDisabled ? t('panel.startServer.steps.launchLocalServer.custom.control.backDesc'): ""}>
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

        <Tooltip title={isNextDisabled ? t('panel.startServer.steps.launchLocalServer.custom.control.nextDesc'): ""}>
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

export const NotFoundCustom: React.VFC<FormProps> = ({ handleBack, handleNext }) => {
  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mt: 4, mb: 2 }} variant="h3" component="div">
          Not Yet Implemented
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button
          onClick={handleNext}
          disabled={true}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  )
}

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
import { launchTunnel, interruptTunnel, updateTokenServer } from "./features/tunnelSlice";
import { FormCustom, FormFactorio, FormMinecraft, NotFoundCustom, OperationButton, ResultChip } from "./Forms";
import { useAppSelector, useAppDispatch } from './app/hooks'
import AutoScroll from "@brianmcallister/react-auto-scroll";
import { updateGame } from "./features/localSlice";
import { GameId } from "./common";
import { useTranslation } from "react-i18next";

export type Navigation = {
  handleBack: () => void,
  handleNext: () => void,
}

export type StepSelectGameProps = {
} & Navigation;

export const StepSelectGame: React.VFC<StepSelectGameProps> = ({ handleBack, handleNext }) => {
  const game = useAppSelector(state => state.local.game)
  const dispatch = useAppDispatch()
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="select-game-label">{t('panel.startServer.steps.selectGame.forms.selectGame')}</InputLabel>
        <Select
          labelId="select-game-label"
          id="select-game"
          value={game}
          label={t('panel.startServer.steps.selectGame.forms.selectGame')}
          onChange={(e: SelectChangeEvent<GameId>) => dispatch(updateGame(e.target.value as GameId))}
        >
          {/* <MenuItem value={'http'}>HTTP</MenuItem> */}
          <MenuItem value={'custom'}>{t('panel.startServer.steps.selectGame.forms.games.custom')}</MenuItem>
          <MenuItem value={'minecraft'}>{t('panel.startServer.steps.selectGame.forms.games.minecraft')}</MenuItem>
          <MenuItem value={'factorio'}>{t('panel.startServer.steps.selectGame.forms.games.factorio')}</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button onClick={handleNext}>
          {t('common.control.next')}
        </Button>
      </Box>
    </React.Fragment>
  )
}

export type StepLaunchLocalServerProps = {
} & Navigation;

export const StepLauchLocalServer: React.VFC<StepLaunchLocalServerProps> = (props) => {
  const game = useAppSelector(state => state.local.game)
  switch (game) {
    case 'minecraft':
      return (
        <FormMinecraft {...props} />
      )
    case 'factorio':
      return (
        <FormFactorio {...props} />
      )
    case 'custom':
      return (
        <FormCustom {...props} />
      )
    default:
      return (
        <NotFoundCustom {...props} />
      )
  }
}

export type StepLaunchTunnelProps = {
} & Navigation;

export const StepLaunchTunnel: React.VFC<StepLaunchTunnelProps> = ({ handleBack, handleNext }) => {
  const tokenServer = useAppSelector(state => state.tunnel.tokenServer)
  const tunnelError = useAppSelector(state => state.tunnel.error)
  const tunnelStatus = useAppSelector(state => state.tunnel.tunnelStatus)
  const clientInfo = useAppSelector(state => state.tunnel.clientInfo)
  const dispatch = useAppDispatch()
  const { t, i18n } = useTranslation();

  const isBackDisabled = tunnelStatus === 'running'
  const isNextDisabled = tunnelStatus !== 'running'

  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ mb: 2 }} variant="h6" component="div">
              {t('panel.startServer.steps.configureOwnServer.settings')}
            </Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{t('panel.startServer.steps.configureOwnServer.advancedSettings.label')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  id="auth-server-url"
                  label={t('panel.startServer.steps.configureOwnServer.advancedSettings.authServerUrl')}
                  variant="outlined"
                  onChange={e => dispatch(updateTokenServer(e.target.value))}
                  value={tokenServer}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              {t('panel.startServer.steps.configureOwnServer.tasks.label')}
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{t('panel.startServer.steps.configureOwnServer.tasks.launchOwnServer')} <ResultChip status={tunnelStatus}/></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {clientInfo ?
                    <div>
                      <p>{t('panel.startServer.steps.configureOwnServer.tasks.clientID')}: {clientInfo.client_id}</p>
                      <p>{t('panel.startServer.steps.configureOwnServer.tasks.publicAddress')}: {clientInfo.remote_addr}</p>
                    </div>
                    : <div></div>
                  }
                  {tunnelError ? tunnelError : ""}
                </Typography>
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
              status={tunnelStatus}
              launch={launchTunnel}
              interrupt={interruptTunnel}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Tooltip title={isBackDisabled ? t('panel.startServer.steps.configureOwnServer.control.backDesc'): ""}>
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

        <Tooltip title={isNextDisabled ? t('panel.startServer.steps.configureOwnServer.control.nextDesc'): ""}>
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

export type StepMonitoringProps = {
} & Navigation;

export const StepMonitoring: React.VFC<StepMonitoringProps> = ({ handleBack, handleNext }) => {
  const clientInfo = useAppSelector(state => state.tunnel.clientInfo)
  const localMessages = useAppSelector(state => state.local.messages)
  const { t, i18n } = useTranslation();
  return (
    <React.Fragment>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>
              {t('panel.startServer.steps.monitor.publicAddress')}: {clientInfo ? clientInfo.remote_addr : "<error>"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              {t('panel.startServer.steps.monitor.serverLogs')}:
            </Typography>

            <Box
              id="local-server-inf"
              sx={{
                border: '1px solid gray',
                borderRadius: '4px',
                padding: 1,
              }}
            >
              <AutoScroll
                showOption={false}
                height={300}
              >
                {localMessages.map(msg => {
                  return (
                    <div key={msg.key}>
                      {msg.message}
                    </div>
                  );
                })}
              </AutoScroll>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          onClick={handleBack}
        >
          {t('common.control.back')}
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

      </Box>
    </React.Fragment>
  )
}

export type StepContentProps = {
  step: number,
  handleReset: () => void,
} & StepSelectGameProps & StepLaunchLocalServerProps & StepLaunchTunnelProps & StepMonitoringProps;

export const StepContent: React.VFC<StepContentProps> = ({ step, handleBack, handleNext, handleReset }) => {
  switch (step) {
    case 0:
      return (
        <StepSelectGame
          handleBack={handleBack}
          handleNext={handleNext}
        />
      )
    case 1:
      return (
        <StepLauchLocalServer
          handleBack={handleBack}
          handleNext={handleNext}
        />
      )
    case 2:
      return (
        <StepLaunchTunnel
          handleBack={handleBack}
          handleNext={handleNext}
        />
      )
    case 3:
      return (
        <StepMonitoring
          handleBack={handleBack}
          handleNext={handleNext}
        />
      )
    default:
      return (
        <React.Fragment />
      )
  }
}

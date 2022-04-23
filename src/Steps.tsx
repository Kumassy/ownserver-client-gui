import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
import { launchTunnel, interruptTunnel, updateTokenServer } from "./features/tunnelSlice";
import { FormCustom, FormMinecraft, NotFoundCustom, OperationButton, ResultChip } from "./Forms";
import { useAppSelector, useAppDispatch } from './app/hooks'
import AutoScroll from "@brianmcallister/react-auto-scroll";
import { updateGame } from "./features/localSlice";
import { GameId } from "./common";

export type Navigation = {
  handleBack: () => void,
  handleNext: () => void,
}

export type StepSelectGameProps = {
} & Navigation;

export const StepSelectGame: React.VFC<StepSelectGameProps> = ({ handleBack, handleNext }) => {
  const game = useAppSelector(state => state.local.game)
  const dispatch = useAppDispatch()

  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="select-game-label">Select Game</InputLabel>
        <Select
          labelId="select-game-label"
          id="select-game"
          value={game}
          label="Game"
          onChange={(e: SelectChangeEvent<GameId>) => dispatch(updateGame(e.target.value as GameId))}
        >
          {/* <MenuItem value={'http'}>HTTP</MenuItem> */}
          <MenuItem value={'custom'}>Custom</MenuItem>
          <MenuItem value={'minecraft'}>Minecraft</MenuItem>
          {/* <MenuItem value={'factorio'}>Factorio</MenuItem> */}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={true}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button onClick={handleNext}>
          Next
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
  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="auth-server-url"
              label="Auth Server URL"
              variant="outlined"
              onChange={e => dispatch(updateTokenServer(e.target.value))}
              value={tokenServer}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Check List
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>Launch tunnel <ResultChip status={tunnelStatus}/></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {clientInfo ?
                    <div>
                      <p>Your Client ID: {clientInfo.client_id}</p>
                      <p>Your Tunnel Public Address: {clientInfo.remote_addr}</p>
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
        <Button
          color="inherit"
          disabled={tunnelStatus === 'running'}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button
          onClick={handleNext}
          disabled={tunnelStatus !== 'running'}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  )
}

export type StepMonitoringProps = {
} & Navigation;

export const StepMonitoring: React.VFC<StepMonitoringProps> = ({ handleBack, handleNext }) => {
  const clientInfo = useAppSelector(state => state.tunnel.clientInfo)
  const localMessages = useAppSelector(state => state.local.messages)
  return (
    <React.Fragment>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>
              Your Tunnel Public Address: {clientInfo ? clientInfo.remote_addr : "<error>"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Local Server Log:
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
          Back
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
    case 4:
      return (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      )
    default:
      return (
        <React.Fragment />
      )
  }
}

import React from 'react'
import { killChild, updateCommand, updateFilepath,  updateLocalPort, runChecksAndLaunchLocal } from './features/localSlice'
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

export type FormProps = {
  handleNext: () => void,
  handleBack: () => void,
}

export type OperationButtonProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  launch: any
  interrupt: any
}

export const OperationButton: React.VFC<OperationButtonProps> = ({ status, launch, interrupt }) => {
  const dispatch = useAppDispatch()

  switch (status) {
    case 'idle':
    case 'succeeded':
    case 'failed':
      return (
        <Button
          variant="contained"
          onClick={() => dispatch(launch())}
        >
          Start
        </Button>
      )
    case 'running':
      return (
        <Button
          variant="contained"
          onClick={() => dispatch(interrupt())}
        >
          Stop
        </Button>
      )
  }
}

type ResultChipProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
}

export const ResultChip: React.VFC<ResultChipProps> = ({ status }) => {
  switch (status) {
    case 'idle':
      return (
        <React.Fragment></React.Fragment>
      )
    case 'running':
      return (
        <Chip label="Running" color="info" />
      )
    case 'succeeded':
      return (
        <Chip label="Pass" color="success" />
      )
    case 'failed':
      return (
        <Chip label="Failed" color="error" />
      )
  }
}

export const FormMinecraft: React.VFC<FormProps> = ({ handleBack, handleNext }) => {
  const localMessages = useAppSelector(state => state.local.messages)
  const localStatus = useAppSelector(state => state.local.status)
  const localPort = useAppSelector(state => state.local.port)
  const command = useAppSelector(state => state.local.command)
  const checks = useAppSelector(state => state.local.checks)
  const filepath = useAppSelector(state => 'filepath' in state.local.config ? state.local.config.filepath : 'Error: filepath not exists')
  const dispatch = useAppDispatch()

  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          設定
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2}}>
          <Button
            variant="contained"
            onClick={async () => {
              const file = await open({ multiple: false });

              if (typeof file === 'string') {
                dispatch(updateFilepath(file))
              }
            }}
          >
            ファイル選択
          </Button>
          <Typography>{filepath}</Typography>
        </Stack>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>上級者向け設定</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id="local-server-path"
              label="Local Server Executable Path"
              variant="outlined"
              onChange={e => dispatch(updateCommand(e.target.value))}
              value={command}
            />
            <TextField
              fullWidth
              id="local-port"
              label="Local Port"
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
              タスク一覧
            </Typography>

            {checks.map(check => {
              return (
                <Accordion key={check.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>{check.id} <ResultChip status={check.status} /></Typography>
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
                <Typography>ゲームサーバーを起動 <ResultChip status={localStatus} /></Typography>
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
        <Button
          color="inherit"
          disabled={localStatus === 'running'}
          onClick={handleBack}
        >
          前へ
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button
          onClick={handleNext}
          disabled={localStatus !== 'running'}
        >
          次へ
        </Button>
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
  const dispatch = useAppDispatch()
  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          設定
        </Typography>

        <TextField
          fullWidth
          id="local-server-path"
          label="Local Server Executable Path"
          variant="outlined"
          onChange={e => dispatch(updateCommand(e.target.value))}
          value={command ? command : ''}
        />
        <TextField
          fullWidth
          id="local-port"
          label="Local Port"
          type="number"
          variant="outlined"
          onChange={e => dispatch(updateLocalPort(parseInt(e.target.value)))}
          value={localPort}
        />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              タスク一覧
            </Typography>

            {checks.map(check => {
              return (
                <Accordion key={check.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>{check.id} <ResultChip status={check.status} /></Typography>
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
                <Typography>ゲームサーバーを起動 <ResultChip status={localStatus} /></Typography>
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
        <Button
          color="inherit"
          disabled={localStatus === 'running'}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button
          onClick={handleNext}
          disabled={localStatus !== 'running'}
        >
          Next
        </Button>
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

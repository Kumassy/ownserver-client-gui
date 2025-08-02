import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Checkbox, Collapse, FormControlLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Protocol } from '../common';
import { useTranslation } from 'react-i18next';
import { FormProps } from '../types';
import { CUSTOM_STATE_ENDPOINT_DEFAULT_KEY, addEndpoint, removeEndpoint, updateCommand, updateLocalPort, updateProtocol } from '../features/reducers/games/custom';
import { GameTaskSection } from './components/GameTaskSection';
import { FormFooter } from './components/FormFooter';

export const FormCustom: React.FC<FormProps> = ({ handleBack, handleNext }) => {
  const localStatus = useAppSelector(state => state.local.status)
  const command = useAppSelector(state => state.local.config.custom.command)
  const endpoints = useAppSelector(state => state.local.config.custom.endpoints)
  const { t } = useTranslation();
  const dispatch = useAppDispatch()

  const [useLocalFeature, setUseLocalFeature] = useState(false);

  const isBackDisabled = localStatus === 'running'
  const isNextDisabled = (useLocalFeature && localStatus !== 'running')
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.port')}</TableCell>
                <TableCell>{t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.protocol.label')}</TableCell>
                <TableCell>{t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.operation.label')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((endpoint) => (
                <TableRow
                  key={endpoint.key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      onChange={e => dispatch(updateLocalPort({key: endpoint.key, port: parseInt(e.target.value)}))}
                      value={endpoint.port}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={endpoint.protocol}
                      onChange={(e: SelectChangeEvent<Protocol>) => dispatch(updateProtocol({key: endpoint.key, protocol: e.target.value as Protocol}))}
                    >
                      <MenuItem value={'TCP'}>{t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.protocol.tcp')}</MenuItem>
                      <MenuItem value={'UDP'}>{t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.protocol.udp')}</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="inherit"
                      onClick={e => dispatch(removeEndpoint(endpoint.key))}
                      disabled={endpoint.key === CUSTOM_STATE_ENDPOINT_DEFAULT_KEY}
                    >
                      {t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.operation.remove')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>
                </TableCell>
                <TableCell>
                  <Button
                    color="inherit"
                    onClick={e => dispatch(addEndpoint())}
                  >
                    {t('panel.startServer.steps.launchLocalServer.custom.settings.endpoints.operation.add')}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <FormControlLabel
          control={
            <Checkbox
              checked={useLocalFeature}
              onChange={() => setUseLocalFeature(!useLocalFeature)}
              name="useLocalFeature"
            />
          }
          label={t('panel.startServer.steps.launchLocalServer.custom.settings.useLocalFeature')}
        />

        <Collapse in={useLocalFeature}>
          <TextField
            fullWidth
            id="local-server-command"
            label={t('panel.startServer.steps.launchLocalServer.custom.settings.command')}
            variant="outlined"
            onChange={e => dispatch(updateCommand(e.target.value))}
            value={command ? command : ''}
          />

          <GameTaskSection gameKey="custom" />
        </Collapse>

      </Box>
      <FormFooter
        gameKey="custom"
        handleBack={handleBack}
        handleNext={handleNext}
        isBackDisabled={isBackDisabled}
        isNextDisabled={isNextDisabled}
      />
    </React.Fragment>
  )
}

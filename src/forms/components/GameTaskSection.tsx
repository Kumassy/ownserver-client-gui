import React from 'react';
import { killChild, runChecksAndLaunchLocal } from '../../features/localSlice';
import { useAppSelector } from '../../app/hooks';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AutoScroll from '@brianmcallister/react-auto-scroll';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OperationButton, ResultChip } from '../../utils';

interface GameTaskSectionProps {
  gameKey: string;
  isOperationButtonDisabled?: boolean;
}

export const GameTaskSection: React.FC<GameTaskSectionProps> = ({ gameKey, isOperationButtonDisabled }) => {
  const localMessages = useAppSelector(state => state.local.messages);
  const localStatus = useAppSelector(state => state.local.status);
  const checks = useAppSelector(state => state.local.checks);
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            {t(`panel.startServer.steps.launchLocalServer.${gameKey}.tasks.label`)}
          </Typography>

          {checks.map(check => (
            <Accordion key={check.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {t(`panel.startServer.checks.${check.label}`)} <ResultChip status={check.status} />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{check.message}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {t(`panel.startServer.steps.launchLocalServer.${gameKey}.tasks.start`)} <ResultChip status={localStatus} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AutoScroll showOption={false} height={100}>
                {localMessages.map(msg => (
                  <div key={msg.key}>{msg.message}</div>
                ))}
              </AutoScroll>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid>
          <Tooltip title={isOperationButtonDisabled ? t(`panel.startServer.steps.launchLocalServer.${gameKey}.control.operationDesc`) : ''}>
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
    </React.Fragment>
  );
};


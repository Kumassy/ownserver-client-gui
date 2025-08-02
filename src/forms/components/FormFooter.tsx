import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FormFooterProps {
  gameKey: string;
  handleBack: () => void;
  handleNext: () => void;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  gameKey,
  handleBack,
  handleNext,
  isBackDisabled,
  isNextDisabled,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
      <Tooltip
        title={isBackDisabled ? t(`panel.startServer.steps.launchLocalServer.${gameKey}.control.backDesc`) : ''}
      >
        <span>
          <Button color="inherit" disabled={isBackDisabled} onClick={handleBack}>
            {t('common.control.back')}
          </Button>
        </span>
      </Tooltip>
      <Box sx={{ flex: '1 1 auto' }} />

      <Tooltip
        title={isNextDisabled ? t(`panel.startServer.steps.launchLocalServer.${gameKey}.control.nextDesc`) : ''}
      >
        <span>
          <Button onClick={handleNext} disabled={isNextDisabled}>
            {t('common.control.next')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

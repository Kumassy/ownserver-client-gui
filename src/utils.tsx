import { useTranslation } from "react-i18next";
import { useAppDispatch } from "./app/hooks";
import { OperationButtonProps, ResultChipProps } from "./types";
import Button from "@mui/material/Button";
import React from "react";
import Chip from "@mui/material/Chip";

export const OperationButton: React.VFC<OperationButtonProps> = ({ status, disabled, launch, interrupt }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation();

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


export const ResultChip: React.VFC<ResultChipProps> = ({ status }) => {
  const { t } = useTranslation();

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

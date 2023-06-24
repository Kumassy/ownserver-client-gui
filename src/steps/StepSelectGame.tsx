import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateGame } from "../features/localSlice";
import { GameId } from "../common";
import { useTranslation } from "react-i18next";
import { StepSelectGameProps } from "./types";


export const StepSelectGame: React.FC<StepSelectGameProps> = ({ handleBack, handleNext }) => {
  const game = useAppSelector(state => state.local.game)
  const dispatch = useAppDispatch()
  const { t } = useTranslation();

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

import React from "react";
import { FormCustom, FormFactorio, FormMinecraft, FormNotFound } from "../forms";
import { useAppSelector } from '../app/hooks';
import { StepLaunchLocalServerProps } from "./types";

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
        <FormNotFound {...props} />
      )
  }
}

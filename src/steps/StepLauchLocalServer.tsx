import React from "react";
import { FormCustom, FormFactorio, FormMinecraft, FormMinecraftBe, FormNotFound } from "../forms";
import { useAppSelector } from '../app/hooks';
import { StepLaunchLocalServerProps } from "./types";

export const StepLauchLocalServer: React.FC<StepLaunchLocalServerProps> = (props) => {
  const game = useAppSelector(state => state.local.game)
  switch (game) {
    case 'minecraft':
      return (
        <FormMinecraft {...props} />
      )
    case 'minecraft_be':
      return (
        <FormMinecraftBe {...props} />
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

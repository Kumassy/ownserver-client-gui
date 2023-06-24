import { Navigation } from "../types";

export type StepLaunchLocalServerProps = {
} & Navigation;
export type StepLaunchTunnelProps = {
} & Navigation;


export type StepMonitoringProps = {
} & Navigation;

export type StepContentProps = {
  step: number,
  handleReset: () => void,
} & StepSelectGameProps & StepLaunchLocalServerProps & StepLaunchTunnelProps & StepMonitoringProps;

export type StepSelectGameProps = {
} & Navigation;

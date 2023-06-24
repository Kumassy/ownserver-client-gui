import React from "react";
import { StepContentProps } from "./types";
import { StepSelectGame } from "./StepSelectGame";
import { StepLauchLocalServer } from "./StepLauchLocalServer";
import { StepLaunchTunnel } from "./StepLaunchTunnel";
import { StepMonitoring } from "./StepMonitoring";



export const StepContent: React.FC<StepContentProps> = ({ step, handleBack, handleNext, handleReset }) => {
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
    default:
      return (
        <React.Fragment />
      )
  }
}

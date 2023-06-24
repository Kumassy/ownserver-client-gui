
export type FormProps = {
  handleNext: () => void,
  handleBack: () => void,
}

export type OperationButtonProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  disabled?: boolean
  launch: any
  interrupt: any
}

export type ResultChipProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
}

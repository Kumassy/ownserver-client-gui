
export type FormProps = {
} & Navigation

export type OperationButtonProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  disabled?: boolean
  launch: any
  interrupt: any
}

export type ResultChipProps = {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
}


export type Navigation = {
  handleBack: () => void,
  handleNext: () => void,
}

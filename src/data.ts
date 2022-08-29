export type LaunchResultError =
  | {
    kind: 'LaunchFailed',
    message: string
  }
  | {
    kind: 'InternalClientError',
    message: string
  }
  | {
    kind: 'ClientExited',
    message: string
  };

export const isLaunchResultError = (e: unknown): e is LaunchResultError => {
  const error = e as LaunchResultError;
  if (typeof error !== 'object' || e === null) {
    return false;
  }
  if ('kind' in error) {
    if (
      error.kind === 'LaunchFailed' ||
      error.kind === 'InternalClientError' ||
      error.kind === 'ClientExited'
    ) {
      return true
    }
  }
  return false
}

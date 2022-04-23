import { Command } from '@tauri-apps/api/shell'
import { GameId } from './common'

export type CheckId = string

export type CheckResult = string
export type CheckError = string

// Check Pass: returns message with CheckResult
// Check Fail: throw errors containing error message
export type CheckFunc = () => Promise<CheckResult>
export class StatusCodeError extends Error {}

export interface CheckRegistry {
  [id: CheckId]: CheckFunc
}

export const CHECK_JAVA_VERSION: CheckId = 'check-java-version'
export const CHECK_BASH_VERSION: CheckId = 'check-bash-version'
export const CHECK_NODE_VERSION: CheckId = 'check-node-version'

export const checkRegistry: CheckRegistry = {
  [CHECK_JAVA_VERSION]: async () => {
    const output = await new Command('run-java-version', ['--version']).execute()
    if (output.code !== 0) {
      const message = `test exited with non-zero code: ${output.code}, stderr: ${output.stderr}`
      throw new StatusCodeError(message)
    }
    return output.stdout
  },
  [CHECK_BASH_VERSION]: async () => {
    const output = await new Command('run-bash-version', ['--version']).execute()
    if (output.code !== 0) {
      const message = `test exited with non-zero code: ${output.code}, stderr: ${output.stderr}`
      throw new StatusCodeError(message)
    }
    return output.stdout
  },
  [CHECK_NODE_VERSION]: async () => {
    const output = await new Command('run-node-version', ['--version']).execute()
    if (output.code !== 0) {
      const message = `test exited with non-zero code: ${output.code}, stderr: ${output.stderr}`
      throw new StatusCodeError(message)
    }
    return output.stdout
  },
}

// export interface CheckRegistry {
//   [game: string]: Array<CheckId>
// }

export const getCheckList = (game: GameId): Array<CheckId> => {
  switch (game) {
    case 'custom':
      return [CHECK_BASH_VERSION]
    case 'http':
      return [CHECK_BASH_VERSION]
    case 'minecraft':
      return [CHECK_JAVA_VERSION]
    case 'factorio':
      return [CHECK_JAVA_VERSION, CHECK_BASH_VERSION, CHECK_NODE_VERSION]
  }
}

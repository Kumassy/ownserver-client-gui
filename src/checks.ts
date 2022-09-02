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
export const CHECK_SH_VERSION: CheckId = 'check-sh-version'
export const CHECK_DOCKER_VERSION: CheckId = 'check-docker-version'

export const checkRegistry: CheckRegistry = {
  [CHECK_JAVA_VERSION]: async () => {
    const output = await new Command('run-java', ['--version']).execute()
    if (output.code !== 0) {
      const message = `test exited with non-zero code: ${output.code}, stderr: ${output.stderr}`
      throw new StatusCodeError(message)
    }
    return output.stdout
  },
  [CHECK_SH_VERSION]: async () => {
    const output = await new Command('run-sh', ['--version']).execute()
    if (output.code !== 0) {
      const message = `test exited with non-zero code: ${output.code}, stderr: ${output.stderr}`
      throw new StatusCodeError(message)
    }
    return output.stdout
  },
  [CHECK_DOCKER_VERSION]: async () => {
    const output = await new Command('run-docker', ['--version']).execute()
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

export type CheckEntry = {
  id: CheckId,
  label: string
}
export const getCheckList = (game: GameId): Array<CheckEntry> => {
  switch (game) {
    case 'custom':
      return [{ id: CHECK_SH_VERSION, label: "shVersion" } ]
    case 'http':
      return []
    case 'minecraft':
      return [{ id: CHECK_JAVA_VERSION, label: "javaVersion"}]
    case 'factorio':
      return [{ id: CHECK_DOCKER_VERSION, label: "dockerVersion"}]
  }
}

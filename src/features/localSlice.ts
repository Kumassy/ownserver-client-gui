import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { invoke } from '@tauri-apps/api/tauri'
import { emit } from '@tauri-apps/api/event'
import { LaunchLocalResultError } from '../data'
import { CheckError, CheckId, checkRegistry, CheckResult, StatusCodeError, getCheckList } from '../checks'
import { GameId } from '../common'

export type LocalStateMessage = {
  key: string,
  message: string,
}

export interface Check {
  id: CheckId,
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  message: string,
}
export const checkJavaVersion: Check = {
  id: 'check-java-version',
  status: 'idle',
  message: "",
}

// Define a type for the slice state
interface LocalState {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  error: null | string,
  message: string,
  messages: Array<LocalStateMessage>,
  command: string,
  filepath: string | null,
  port: number,
  game: GameId,
  checks: Array<Check>,
}
// Define the initial state using that type
const initialState: LocalState = {
  status: 'idle',
  error: null,
  message: '',
  messages: [],
  command: "nc -kl 3010",
  filepath: null,
  port: 3010,
  game: 'minecraft',
  checks: getCheckList('minecraft').map((id: CheckId) => {
    return {
      id,
      status: 'idle',
      message: "",
    }
  })
}

type MessagesEntry = {
  key: string,
  message: string,
}
export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = ''
    },
    receiveMessage: {
      reducer: (state, action: PayloadAction<MessagesEntry>) => {
        state.message += action.payload.message + '\n'
        state.messages.push(action.payload)
      },
      prepare: (message: string) => {
        return { payload: {
          key: nanoid(),
          message
        }}
      }
    },
    updateCommand: (state, action: PayloadAction<string>) => {
      state.command = action.payload
    },
    updateFilepath: (state, action: PayloadAction<string>) => {
      const filepath = action.payload
      state.filepath = filepath
      state.command = `java -Xmx1024M -Xms1024M -jar ${filepath} nogui`
    },
    updateLocalPort: (state, action: PayloadAction<number>) => {
      state.port = action.payload
    },
    updateGame: (state, action: PayloadAction<GameId>) => {
      const game = action.payload;
      state.game = game;
      state.checks = getCheckList(game).map((id: CheckId) => {
        return {
          id,
          status: 'idle',
          message: "",
        }
      })
    },
    interruptLocal: {
      reducer: state => {
        state.status = 'idle'
        state.checks.forEach(check => {
          check.status = 'idle'
        })
        state.error = null
        console.log(`interrupt local ${JSON.stringify(state)}`)
      },
      prepare: () => {
        emit('interrupt_launch_local_server')
        console.log(`emit: interrupt_launch_local_server`)
        return { payload: {}}
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCheck.pending, (state, { meta }) => {
        const checkId = meta.arg;
        const check = state.checks.find(check => check.id === checkId);
        if (check) {
          check.message = ''
          check.status = 'running'
        }
        console.log(`start check ${checkId}, ${JSON.stringify(state)}`)
      })
      .addCase(runCheck.fulfilled, (state, { payload, meta }) => {
        const checkId = meta.arg;
        const check = state.checks.find(check => check.id === checkId);
        if (check) {
          check.message = payload;
          check.status = 'succeeded'
        }
        console.log(`fulfilled check ${checkId}, ${JSON.stringify(state)}`)
      })
      .addCase(runCheck.rejected, (state, action) => {
        const checkId = action.meta.arg;
        if (action.payload) {
          const check = state.checks.find(check => check.id === checkId);
          if (check) {
            check.message = action.payload;
            check.status = 'failed'
          }
        } else {
          state.message = `${action.error.message}`
        }
        console.log(`rejected check ${checkId}, ${JSON.stringify(state)}`)
      })
      .addCase(launchLocal.pending, (state, { meta }) => {
        state.status = 'running'
        state.error = null
        state.message = ''

        console.log(`start local ${JSON.stringify(state)}`)
      })
      .addCase(launchLocal.fulfilled, (state, { payload, meta }) => {
        state.status = 'succeeded'
        state.error = null
        console.log(`fulfilled local ${JSON.stringify(state)}`)
      })
      .addCase(launchLocal.rejected, (state, action) => {
        state.status = 'failed'
        const err = action.payload

        if (err) {
          if (err.kind === "StatusCodeError") {
            state.error = `exited with non-zero code`
          } else if (err.kind === "SpawnFailed") {
            state.error = `Failed to spawn executables ${err.payload}`
          } else if (err.kind === "NoStdout") {
            state.error = `Failed to fetch stdout`
          } else if (err.kind === "NoStderr") {
            state.error = `Failed to fetch stderr`
          } else if(err.kind === "LineCorrupted") {
            state.error = `Failed to parse stdout ${err.payload}`
          } else if (err.kind === "WaitFailed") {
            state.error = `Failed to wait local server`
          } else {
            state.error = "Internal client error: other error"
          }
        } else {
          state.error = `Unkwown error: ${action.error.message}`
        }

        console.log(`rejected local ${JSON.stringify(state)}`)
      })
      .addCase(runChecksAndLaunchLocal.pending, (state, action) => {
        console.log(`start runCHecksAndLaunchLocal`)
      })
      .addCase(runChecksAndLaunchLocal.fulfilled, (state, action) => {
        console.log(`fullfilled runCHecksAndLaunchLocal`)
      })
      .addCase(runChecksAndLaunchLocal.rejected, (state, action) => {
        console.log(`rejected runCHecksAndLaunchLocal`)
      })
  },
})
export const launchLocal = createAsyncThunk<void, undefined, { state: RootState, rejectValue: LaunchLocalResultError }>('launchLocal', async (_, { getState, rejectWithValue }) => {
  try {
    await invoke('launch_local_server', { command: getState().local.command })
  } catch (e) {
    const err = e as LaunchLocalResultError;
    return rejectWithValue(err)
  }
})

export const runCheck = createAsyncThunk<CheckResult, CheckId, { state: RootState, rejectValue: CheckError }>('checks/runCheck', async (id, { getState, rejectWithValue }) => {
  console.log(getState().local);
  let check = getState().local.checks.find(check => check.id === id);

  if (check) {
    try {
      const testResult: CheckResult = await checkRegistry[check.id]()
      return testResult
    } catch (e) {
      if (e instanceof StatusCodeError) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue(`error during check: ${JSON.stringify(e)}`)
    }
  } else {
    throw new Error(`error: check not found with id: ${id}`)
  }
})

export const runChecks = createAsyncThunk<void, undefined, { state: RootState }>('runChecks', async (_, { getState, dispatch }) => {
  let checks = getState().local.checks;

  for (let check of checks) {
    await dispatch(runCheck(check.id)).unwrap()
  }
  // do not catch error caused by runCheck
})

export const runChecksAndLaunchLocal = createAsyncThunk<void, undefined, { state: RootState }>('runChecksAndLaunchLocal', async (_, { dispatch }) => {
  await dispatch(runChecks()).unwrap()
  await dispatch(launchLocal()).unwrap()
})

export const { receiveMessage, updateCommand, updateFilepath, updateLocalPort, updateGame, interruptLocal } = localSlice.actions

export default localSlice.reducer

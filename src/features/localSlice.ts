import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { Child, Command } from '@tauri-apps/api/shell';

import { CheckError, CheckId, checkRegistry, CheckResult, StatusCodeError, getCheckList, CheckEntry } from '../checks'
import { GameId } from '../common'
import { GameState, gameSlice } from './gameSlice';

const MAX_MESSAGES = 1000

export type LocalStateMessage = {
  key: string,
  message: string,
}

export interface Check {
  id: CheckId,
  label: string,
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  message: string,
}

// Define a type for the slice state
export interface LocalState {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  error: null | string,
  messages: Array<LocalStateMessage>,
  game: keyof GameState,
  config: GameState,
  checks: Array<Check>,
  child: Child | null,
  inGameCommand: string, // command sent to local server
}
// Define the initial state using that type
const initialState: LocalState = {
  status: 'idle',
  error: null,
  messages: [],
  game: 'minecraft',
  checks: getCheckList('minecraft').map((entry: CheckEntry) => {
    return {
      id: entry.id,
      label: entry.label,
      status: 'idle',
      message: "",
    }
  }),
  config: gameSlice.getInitialState(),
  child: null,
  inGameCommand: ''
}

type MessagesEntry = {
  key: string,
  channel: 'stdout' | 'stderr',
  message: string,
}


export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    receiveMessage: {
      reducer: (state, action: PayloadAction<MessagesEntry>) => {
        state.messages.push(action.payload)
        if (state.messages.length > MAX_MESSAGES) {
          state.messages = state.messages.slice(-MAX_MESSAGES)
        }
      },
      prepare: (channel: 'stdout' | 'stderr', message: string) => {
        return { payload: {
          key: nanoid(),
          channel,
          message
        }}
      }
    },
    setChild: (state, action: PayloadAction<Child | null>) => {
      state.child = action.payload
    },
    updateGame: (state, action: PayloadAction<GameId>) => {
      const game = action.payload;
      state.game = game;
      state.checks = getCheckList(game).map((entry: CheckEntry) => {
        return {
          id: entry.id,
          label: entry.label,
          status: 'idle',
          message: "",
        }
      })

    },
    updateInGameCommand: (state, action: PayloadAction<string>) => {
      state.inGameCommand = action.payload
    },
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
        }
        console.error(`rejected check ${checkId}, ${JSON.stringify(state)}`)
      })
      .addCase(launchLocal.pending, (state, { meta }) => {
        state.status = 'running'
        state.error = null

        console.log(`start local ${JSON.stringify(state)}`)
      })
      .addCase(launchLocal.fulfilled, (state, { payload, meta }) => {
        state.status = 'succeeded'
        state.error = null
        state.child = null
        console.log(`fulfilled local ${JSON.stringify(state)}`)
      })
      .addCase(launchLocal.rejected, (state, action) => {
        state.status = 'failed'
        state.child = null

        const err = action.payload

        if (err) {
          if (err.kind === "StatusCodeError") {
            state.error = `exited with non-zero code`
          } else if (err.kind === "SpawnFailed") {
            state.error = `Failed to spawn executables ${err.payload}`
          } else if (err.kind === "CommandNotSet") {
            state.error = `command is not set`
          } else {
            state.error = "Internal client error: other error"
          }
        } else {
          state.error = `Unkwown error: ${action.error.message}`
        }

        console.error(`rejected local ${JSON.stringify(state)}`)
      })
      .addCase(killChild.fulfilled, (state) => {
        state.status = 'succeeded'
        state.child = null
      })
      .addCase(killChild.rejected, (state) => {
        state.status = 'failed'
        state.child = null
        console.error('failed to kill child')
      })
      .addCase(runChecksAndLaunchLocal.pending, (state, action) => {
        console.log(`start runCHecksAndLaunchLocal`)
      })
      .addCase(runChecksAndLaunchLocal.fulfilled, (state, action) => {
        console.log(`fullfilled runCHecksAndLaunchLocal`)
      })
      .addCase(runChecksAndLaunchLocal.rejected, (state, action) => {
        console.error(`rejected runCHecksAndLaunchLocal`)
      })
      .addCase(sendInGameCommand.pending, (state, action) => {
        console.log(`start sendInGameCommand`)
      })
      .addCase(sendInGameCommand.fulfilled, (state, action) => {
        console.log(`fullfilled sendInGameCommand`)
        state.inGameCommand = ''
      })
      .addCase(sendInGameCommand.rejected, (state, action) => {
        const err = action.payload
        if (err) {
          if (err.kind === "ChildNotSet") {
            state.error = `ChildNotSet`
          }
        } else {
          state.error = `Unkwown error: ${action.error.message}`
        }
        console.error(`rejected sendInGameCommand`)
      })
      .addMatcher(
        (action) => action.type.startsWith('local/game'),
        (state, action) => {
          gameSlice.reducer(state.config, action)
      })
  },
})

type LaunchLocalError =
  | {
    kind: "StatusCodeError";
    code: number,
    [k: string]: unknown;
  }
  | {
    kind: "SpawnFailed";
    payload: string;
    [k: string]: unknown;
  }
  | {
    kind: "CommandNotSet";
    [k: string]: unknown;
  }


const getCommand = async (rootState: RootState) => {
  const localState = rootState.local
  const game = localState.game

  let command = null
  switch (game) {
    case 'custom':
    case 'minecraft':
    case 'minecraft_be':
    case 'minecraft_forge':
    case 'factorio':
      command = localState.config[game].command
      break;
  }
  if (command === null) {
    throw new Error('command is null')
  }

  // note: '.split('\s+')' -> [']
  const args = command.trim().split(/\s+/)
  if (args[0] === '') {
    throw new Error('command is empty')
  }

  let spawnOptions = undefined
  switch (game) {
    case 'minecraft':
    case 'minecraft_be':
    case 'minecraft_forge':
      const workdir = localState.config[game].workdir
      if (workdir !== null) {
        spawnOptions = {
          cwd: workdir
        }
      }
      break;
  }

  const osType = rootState.tauri.os?.type ?? null
  switch(args[0]) {
    case 'java':
    case 'docker':
      return new Command(args[0], args.splice(1), spawnOptions)
    default:
      if (osType === 'Windows_NT') {
        return new Command('cmd', ['/c', command], spawnOptions)
      } else if (osType !== null) {
        return new Command('sh', ['-c', command], spawnOptions)
      } else {
        throw new Error('tauri state is not initialized')
      }
  }
}

export const launchLocal = createAsyncThunk<void, undefined, { state: RootState, rejectValue: LaunchLocalError }>('launchLocal', async (_, { getState, rejectWithValue, dispatch }) => {
  try {
    const command = await getCommand(getState())
    const p = new Promise((res, rej) => {
      command.on('close', data => {
        console.log(`command finished with code ${data.code} and signal ${data.signal}`);

        if (data.code === 0 || data.signal != null) {
          // also success when child is killed by user (when data.signal != null)
          res(null);
        } else {
          rej({
            kind: "StatusCodeError",
            code: data.code
          })
        }
      });
      command.on('error', error => {
        console.error(`command error: "${error}"`)
        rej({
          kind: "SpawnFailed",
          payload: `command error: "${error}"`,
        });
      });
    })

    command.stdout.on('data', line => dispatch(receiveMessage('stdout', line)));
    command.stderr.on('data', line => dispatch(receiveMessage('stderr', line)));

    const child = await command.spawn();
    dispatch(setChild(child))

    try {
      await p
    } catch (e) {
      console.error(e)
      const err = e as LaunchLocalError;
      return rejectWithValue(err)
    }
  } catch (e) {
    console.error(e)
    return rejectWithValue({
      kind: 'CommandNotSet',
      error: e
    })
  }
})

export const killChild = createAsyncThunk<void, undefined, { state: RootState }>('killChild', async (_, { getState }) => {
  const game = getState().local.game;
  const child = getState().local.child;

  switch(game) {
    case 'factorio':
      const output = await new Command('run-docker', ['stop', `ownserver-local-${game}`]).execute()
      if (output.code !==0 ) {
        throw new Error(`failed to stop container ownserver-local-${game}: ${output}`)
      }
      break;
    case 'minecraft_forge':
      if (child != null) {
        await child.write('/stop')
      }
      await child?.kill();
      break;
    default:
      await child?.kill();
      break;
  }
})

export const runCheck = createAsyncThunk<CheckResult, CheckId, { state: RootState, rejectValue: CheckError }>('checks/runCheck', async (id, { getState, rejectWithValue }) => {
  let state = getState();
  let check = getState().local.checks.find(check => check.id === id);

  if (check) {
    try {
      const testResult: CheckResult = await checkRegistry[check.id](state)
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

type SendInGameCommandError =
  | {
    kind: "ChildNotSet";
    [k: string]: unknown;
  }

export const sendInGameCommand = createAsyncThunk<void, string, { state: RootState, rejectValue: SendInGameCommandError }>('sendInGameCommand', async (command, { getState, rejectWithValue, dispatch }) => {
  const cleanedCommand = command.endsWith('\n') ? command : command + '\n'

  const child = getState().local.child
  if (child == null) {
    return rejectWithValue({
      kind: "ChildNotSet",
    })
  }
  console.log(`send command to local server: ${cleanedCommand}`)
  return await child.write(cleanedCommand)
})

const { setChild } = localSlice.actions;
export const { receiveMessage, updateGame, updateInGameCommand } = localSlice.actions

export default localSlice.reducer

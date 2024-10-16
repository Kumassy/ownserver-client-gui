import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { dirname, basename } from '@tauri-apps/api/path'
import { Child, Command } from '@tauri-apps/api/shell';

import { CheckError, CheckId, checkRegistry, CheckResult, StatusCodeError, getCheckList, CheckEntry } from '../checks'
import { GameId, toLocalPort, Protocol } from '../common'
import { type } from '@tauri-apps/api/os';

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

export type GameConfig = {
  kind: 'custom',
} | {
  kind: 'minecraft',
  filepath: string | null,
  workdir: string | null,
  acceptEula: boolean,
} | {
  kind: 'minecraft_be',
  filepath: string | null,
  workdir: string | null
} | {
  kind: 'minecraft_forge',
  filepath: string | null,
  workdir: string | null,
  acceptEula: boolean,
} | {
  kind: 'factorio',
  savepath: string | null,
}


// Define a type for the slice state
export interface LocalState {
  status: 'idle' | 'running' | 'succeeded' | 'failed',
  error: null | string,
  messages: Array<LocalStateMessage>,
  command: string | null, // command to launch local server
  port: number,
  protocol: Protocol,
  game: GameId,
  config: GameConfig,
  checks: Array<Check>,
  child: Child | null,
  inGameCommand: string, // command sent to local server
}
// Define the initial state using that type
const initialState: LocalState = {
  status: 'idle',
  error: null,
  messages: [],
  command: null,
  port: toLocalPort('minecraft'),
  protocol: 'tcp',
  game: 'minecraft',
  checks: getCheckList('minecraft').map((entry: CheckEntry) => {
    return {
      id: entry.id,
      label: entry.label,
      status: 'idle',
      message: "",
    }
  }),
  config: {
    kind: 'minecraft',
    filepath: null,
    workdir: null,
    acceptEula: false,
  },
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
    updateCommand: (state, action: PayloadAction<string>) => {
      state.command = action.payload
    },
    updateLocalPort: (state, action: PayloadAction<number>) => {
      state.port = action.payload
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

      state.port = toLocalPort(game);
      switch (game) {
        case 'custom':
          state.command = 'nc -kl 3010'
          state.config = {
            kind: 'custom',
          }
          state.protocol = 'tcp'
          break;
        case 'minecraft':
          state.command = null
          state.config = {
            kind: 'minecraft',
            filepath: null,
            workdir: null,
            acceptEula: false,
          }
          state.protocol = 'tcp'
          break;
        case 'minecraft_be':
          state.command = null
          state.config = {
            kind: 'minecraft_be',
            filepath: null,
            workdir: null,
          }
          state.protocol = 'udp'
          break;
        case 'minecraft_forge':
          state.command = null
          state.config = {
            kind: 'minecraft_forge',
            filepath: null,
            workdir: null,
            acceptEula: false,
          }
          state.protocol = 'tcp'
          break;
        case 'factorio':
          state.command = null
          state.config = {
            kind: 'factorio',
            savepath: null
          }
          state.protocol = 'udp'
      }
    },
    updateAcceptEula: (state, action: PayloadAction<boolean>) => {
      if (state.config.kind !== 'minecraft' && state.config.kind !== 'minecraft_forge') return
      state.config.acceptEula = action.payload
    },
    updateProtocol: (state, action: PayloadAction<Protocol>) => {
      state.protocol = action.payload
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
      .addCase(updateFilepath.fulfilled, (state, action) => {
        const { dirname, basename } = action.payload
        const filepath = action.meta.arg

        switch(state.config.kind) {
          case 'minecraft':
            state.config.filepath = filepath
            state.config.workdir = dirname
            state.command = `java -Xmx1024M -Xms1024M -jar ${filepath} nogui`
            break;
          case 'minecraft_be':
            state.config.filepath = filepath
            state.config.workdir = dirname
            state.command = `${filepath}`
            break;
          case 'minecraft_forge':
            state.config.filepath = filepath
            state.config.workdir = dirname
            state.command = `${filepath}`
            break;
          case 'factorio':
            state.config.savepath = filepath
            state.command = `docker run --rm -i -p ${state.port}:34197/udp -v ${state.config.savepath}:/factorio --name ownserver-local-factorio factoriotools/factorio`
            break;
        }
      })
      .addCase(updateFilepath.rejected, () => {
        console.error(`rejected updateFilepath`)
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


const getCommand = async (localState: LocalState) => {
  const { command, config } = localState
  if (command === null) {
    throw new Error('command is null')
  }

  const osType = await type();
  // note: '.split('\s+')' -> [']
  const args = command.trim().split(/\s+/)
  if (args[0] === '') {
    throw new Error('command is empty')
  }

  let spawnOptions = undefined
  if ('workdir' in config && config.workdir) {
    spawnOptions = {
      cwd: config.workdir
    }
  }

  switch(args[0]) {
    case 'java':
      return new Command('run-java', args.splice(1), spawnOptions)
    case 'docker':
      return new Command('run-docker', args.splice(1), spawnOptions)
    default:
      if (osType === 'Windows_NT') {
        return new Command('run-cmd', ['/c', command], spawnOptions)
      } else {
        return new Command('run-sh', ['-c', command], spawnOptions)
      }
  }
}

export const launchLocal = createAsyncThunk<void, undefined, { state: RootState, rejectValue: LaunchLocalError }>('launchLocal', async (_, { getState, rejectWithValue, dispatch }) => {
  try {
    const command = await getCommand(getState().local)
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
      'kind': 'CommandNotSet'
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

interface FilePathInfo {
  dirname: string,
  basename: string
}

export const updateFilepath = createAsyncThunk<FilePathInfo, string>('updateFilepath', async (filepath) => {
  return {
    dirname: await dirname(filepath),
    basename: await basename(filepath),
  }
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
export const { receiveMessage, updateCommand, updateLocalPort, updateGame, updateProtocol, updateInGameCommand, updateAcceptEula } = localSlice.actions

export default localSlice.reducer

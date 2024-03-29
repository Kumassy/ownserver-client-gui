import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { invoke } from '@tauri-apps/api/tauri'
import { isLaunchResultError, LaunchResultError } from '../data'
import { emit } from '@tauri-apps/api/event'

export interface ClientInfo {
  client_id: string,
  remote_addr: string,
}

// Define a type for the slice state
interface TunnelState {
  tunnelStatus: 'idle' | 'running' | 'succeeded' | 'failed',
  clientInfo: null | ClientInfo,
  error: null | string,
  tokenServer: string,
}

// Define the initial state using that type
const initialState: TunnelState = {
  tunnelStatus: 'idle',
  clientInfo: null,
  error: null,
  tokenServer: "https://auth.ownserver.kumassy.com/v1/request_token",
}

export const tunnelSlice = createSlice({
  name: 'tunnel',
  initialState,
  reducers: {
    updateClientInfo: (state, action: PayloadAction<ClientInfo>) => {
      const clientInfo = {
        client_id: action.payload.client_id,
        remote_addr: action.payload.remote_addr,
      }
      state.clientInfo = clientInfo
    },
    updateTokenServer: (state, action: PayloadAction<string>) => {
      state.tokenServer = action.payload
    },
    interruptTunnel: {
      reducer: state => {
        state.tunnelStatus = 'idle'
        state.clientInfo = null
        state.error = null
        console.log(`interrupt tunnel: ${JSON.stringify(state)}`)
      },
      prepare: () => {
        emit('interrupt_launch_tunnel')
        console.log(`emit: interrupt_launch_tunnel`)
        return { payload: {} }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(launchTunnel.pending, (state) => {
        state.tunnelStatus = 'running'
        state.clientInfo = null
        state.error = null
        console.log(`start tunnel: ${JSON.stringify(state)}`)
      })
      .addCase(launchTunnel.fulfilled, (state) => {
        state.tunnelStatus = 'succeeded'
        state.clientInfo = null
        state.error = null
        console.log(`fullfiled tunnel: ${JSON.stringify(state)}`)
      })
      .addCase(launchTunnel.rejected, (state, action) => {
        state.tunnelStatus = 'failed'

        if (action.payload) {
          state.error = `${JSON.stringify(action.payload)}`
        } else {
          state.error = `${JSON.stringify(action.error)}`
        }
        console.log(`rejected tunnel: ${JSON.stringify(state)}`)
      })
  }
})

export const launchTunnel = createAsyncThunk<void, undefined, { state: RootState, rejectValue: LaunchResultError }>('launchTunnel', async (_, { getState, rejectWithValue }) => {
  const stateBefore = getState()
  const payload = stateBefore.local.protocol
  try {
    // this handle Ok value of launch_tunnel, ()
    // when launch_tunnel returns (), invoke is evaluated as null
    await invoke('launch_tunnel', { tokenServer: stateBefore.tunnel.tokenServer, localPort: stateBefore.local.port, payload })
    return;
  } catch (e) {
    if (isLaunchResultError(e)) {
      return rejectWithValue(e)
    } else {
      throw new Error('unknown error')
    }
  }
})

export const { updateClientInfo, updateTokenServer, interruptTunnel } = tunnelSlice.actions

export const selectClientInfo = (state: RootState) => state.tunnel.clientInfo

export default tunnelSlice.reducer

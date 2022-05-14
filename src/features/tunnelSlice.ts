import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { invoke } from '@tauri-apps/api/tauri'
import { LaunchResult } from '../data'
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
  tokenServer: "https://auth.ownserver.kumassy.com/v0/request_token",
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
          state.error = action.payload
        } else {
          state.error = `${action.error}`
        }
        console.log(`rejected tunnel: ${JSON.stringify(state)}`)
      })
  }
})

export const launchTunnel = createAsyncThunk<void, undefined, { state: RootState, rejectValue: string }>('launchTunnel', async (_, { getState, rejectWithValue }) => {
  const stateBefore = getState()
  try {
    const json: string = await invoke('launch_tunnel', { tokenServer: stateBefore.tunnel.tokenServer, localPort: stateBefore.local.port })
    const result: LaunchResult = JSON.parse(json)

    if (result.Ok) {
      return;
    } else if (result.Err) {
      if (result.Err) {
        return rejectWithValue(JSON.stringify(result.Err))
      }
    } else {
      return rejectWithValue("Internal client error: json parse error")
    }
  } catch (e) {
    return rejectWithValue(JSON.stringify(e))
  }
})

export const { updateClientInfo, updateTokenServer, interruptTunnel } = tunnelSlice.actions

export const selectClientInfo = (state: RootState) => state.tunnel.clientInfo

export default tunnelSlice.reducer

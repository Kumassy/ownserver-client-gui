import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Arch, OsType, Platform } from "@tauri-apps/plugin-os"
import { getVersion, getTauriVersion } from '@tauri-apps/api/app';
import { arch, platform, type, version } from '@tauri-apps/plugin-os';


interface AppEnvState {
  appVersion: string,
  tauriVersion: string,
}
interface OsEnvState {
  arch: Arch,
  platform: Platform,
  type: OsType,
  version: string,
}
export interface EnvState {
  app: AppEnvState | null,
  os: OsEnvState | null,
}

// Define the initial state using that type
const initialState: EnvState = {
  app: null,
  os: null,
}


export const localSlice = createSlice({
  name: 'env',
  initialState,
  reducers: {
    updateAppEnv: (state, action) => {
      state.app = action.payload
    },
    updateOsEnv: (state, action) => {
      state.os = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initEnv.pending, (state) => {
        console.log(`start initEnv ${JSON.stringify(state)}`)
      })
      .addCase(initEnv.fulfilled, (state) => {
        console.log(`fulfilled initEnv ${JSON.stringify(state)}`)
      })
      .addCase(initEnv.rejected, (state) => {
        console.error(`rejected initEnv ${JSON.stringify(state)}`)
      })
  },
})


export const initEnv = createAsyncThunk<void, undefined>('initEnv', async (_, { dispatch }) => {
  const appVersion = await getVersion()
  const tauriVersion = await getTauriVersion()
  dispatch(updateAppEnv({ appVersion, tauriVersion }))


  const archName = await arch();
  const platformName = await platform();
  const osType = await type();
  const osVersion = await version();

  dispatch(updateOsEnv({ arch: archName,
    platform: platformName,
    type: osType,
    version: osVersion
  }))
})


const { updateAppEnv, updateOsEnv } = localSlice.actions;

export default localSlice.reducer;

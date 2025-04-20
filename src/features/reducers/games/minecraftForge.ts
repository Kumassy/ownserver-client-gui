import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EndpointClaim, GameId } from '../../../common';
import { dirname } from '@tauri-apps/api/path';

const game: GameId = 'minecraft_forge'

interface MinecraftForgeConfig {
  kind: 'minecraft_forge',
  filepath: string | null,
  workdir: string | null,
  command: string,
  acceptEula: boolean,
  endpoints: EndpointClaim[],
}

export const MINECRAFT_FORGE_STATE_ENDPOINT_DEFAULT_KEY = 'minecraft-forge-default-endpoint'

export const initialState: MinecraftForgeConfig = {
  kind: 'minecraft_forge',
  filepath: null,
  workdir: null,
  acceptEula: false,
  command: '',
  endpoints: [
    {
      key: MINECRAFT_FORGE_STATE_ENDPOINT_DEFAULT_KEY,
      protocol: 'TCP',
      port: 25565
    }
  ]
};

export const minecraftForgeSlice = createSlice({
  name: `local/game/${game}`,
  initialState,
  reducers: {
    setAcceptEula: (state, action: PayloadAction<boolean>) => {
      state.acceptEula = action.payload;
    },
    updateCommand: (state, action: PayloadAction<string>) => {
      state.command = action.payload;
    },
    updateLocalPort: (state, action: PayloadAction<number>) => {
      state.endpoints[0].port = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateFilepath.fulfilled, (state, action) => {
        const dir = action.payload
        const filepath = action.meta.arg

        state.filepath = filepath
        state.workdir = dir
        state.command = `${filepath}`
      })
      .addCase(updateFilepath.rejected, () => {
        console.error(`${minecraftForgeSlice.name}/updateFilepath rejected`)
      })
  }
})


export const updateFilepath = createAsyncThunk<string, string>(`${minecraftForgeSlice.name}/updateFilepath`, async (filepath) => {
  return await dirname(filepath)
})

export const { setAcceptEula, updateCommand, updateLocalPort } = minecraftForgeSlice.actions
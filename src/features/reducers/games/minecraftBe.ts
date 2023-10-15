import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { dirname } from "@tauri-apps/api/path"
import { EndpointClaim, GameId } from "../../../common"

const game: GameId = 'minecraft_be'

export interface MinecraftBeState {
  filepath: string | null,
  workdir: string | null,
  command: string,
  endpoints: EndpointClaim[],
}

export const initialState: MinecraftBeState = {
  filepath: null,
  workdir: null,
  command: './bedrock_server',
  endpoints: [
    {
      protocol: 'TCP',
      port: 19132,
    }
  ]
}

export const minecraftBeSlice = createSlice({
  name: `local/config/${game}`,
  initialState,
  reducers: {
    updateCommand: (state, action: PayloadAction<string>) => {
      state.command = action.payload
    },
    updateLocalPort: (state, action: PayloadAction<number>) => {
      state.endpoints[0].port = action.payload
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
        console.error(`${minecraftBeSlice.name}/updateFilepath rejected`)
      })
  }
})

export const updateFilepath = createAsyncThunk<string, string>(`${minecraftBeSlice.name}/updateFilepath`, async (filepath) => {
  return await dirname(filepath)
})

export const { updateCommand, updateLocalPort } = minecraftBeSlice.actions

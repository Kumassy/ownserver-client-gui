import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { minecraftSlice,  } from "./reducers/games/minecraft"
import { minecraftBeSlice } from "./reducers/games/minecraftBe"
import { minecraftForgeSlice } from "./reducers/games/minecraftForge"
import { factorioSlice } from "./reducers/games/factorio"
import { customSlice } from "./reducers/games/custom"

export interface GameState {
  custom: ReturnType<typeof customSlice.getInitialState>,
  minecraft: ReturnType<typeof minecraftSlice.getInitialState>,
  minecraft_be: ReturnType<typeof minecraftBeSlice.getInitialState>,
  minecraft_forge: ReturnType<typeof minecraftForgeSlice.getInitialState>,
  factorio: ReturnType<typeof factorioSlice.getInitialState>,
}

// Define the initial state using that type
const initialState: GameState = {
  custom: customSlice.getInitialState(),
  minecraft: minecraftSlice.getInitialState(),
  minecraft_be: minecraftBeSlice.getInitialState(),
  minecraft_forge: minecraftForgeSlice.getInitialState(),
  factorio: factorioSlice.getInitialState()
}


const gamesReducer = combineReducers({
  custom: customSlice.reducer,
  minecraft: minecraftSlice.reducer,
  minecraft_be: minecraftBeSlice.reducer,
  minecraft_forge: minecraftForgeSlice.reducer,
  factorio: factorioSlice.reducer,
})
export const gameSlice = createSlice({
  name: 'local/game',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state, action) => {
      state = gamesReducer(state, action)
    })
  }
})

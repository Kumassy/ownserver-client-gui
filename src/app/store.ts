import { configureStore } from '@reduxjs/toolkit'
import tunnelReducer from '../features/tunnelSlice'
import localReducer from '../features/localSlice'
import envReducer from '../features/envSlice'

const store = configureStore({
    reducer: {
        tunnel: tunnelReducer,
        local: localReducer,
        env: envReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

import { configureStore } from '@reduxjs/toolkit'
import tunnelReducer from '../features/tunnelSlice'
import localReducer from '../features/localSlice'

const store = configureStore({
    reducer: {
        tunnel: tunnelReducer,
        local: localReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

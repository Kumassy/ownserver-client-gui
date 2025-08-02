import { configureStore } from '@reduxjs/toolkit'
import tunnelReducer from '../features/tunnelSlice'
import localReducer, { hydrate, loadLocalState, saveLocalState, selectPersistedLocalState } from '../features/localSlice'
import envReducer from '../features/envSlice'
import tauriReducer from '../features/tauriSlice'

const store = configureStore({
    reducer: {
        tunnel: tunnelReducer,
        local: localReducer,
        env: envReducer,
        tauri: tauriReducer,
    }
});

(async () => {
    try {
        const persisted = await loadLocalState();
        if (persisted) {
            store.dispatch(hydrate(persisted));
        }
    } catch (e) {
        console.error('failed to load local state', e);
    }
    store.subscribe(() => {
        const data = selectPersistedLocalState(store.getState());
        saveLocalState(data).catch(err => console.error('failed to save local state', err));
    });
})();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

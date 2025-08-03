import { configureStore } from '@reduxjs/toolkit'
import tunnelReducer from '../features/tunnelSlice'
import localReducer from '../features/localSlice'
import tauriReducer from '../features/tauriSlice'
import { hydrate, loadState, saveState } from './persist'

const store = configureStore({
    reducer: {
        tunnel: tunnelReducer,
        local: localReducer,
        tauri: tauriReducer,
    }
});

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
}

(async () => {
    try {
        const persisted = await loadState();
        if (persisted) {
            store.dispatch(hydrate(persisted));
        }
    } catch (e) {
        console.error('failed to load state', e);
    }

    const debouncedSave = debounce(() => {
        saveState(store.getState()).catch(err => console.error('failed to save state', err));
    }, 3000);
    store.subscribe(debouncedSave);
})();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Arch, OsType, Platform, arch, platform, type, version } from '@tauri-apps/plugin-os';
import { getVersion, getTauriVersion } from '@tauri-apps/api/app';

interface InitializedTauriState {
  os: {
    arch: Arch;
    platform: Platform;
    type: OsType;
    version: string;
  };
  app: {
    appVersion: string;
    tauriVersion: string;
  };
}

export type InitializeTauriStateError = {
  kind: 'ApiFailed';
  [k: string]: unknown;
};

export type TauriState =
  | { status: 'idle' }
  | { status: 'loading' }
  | ({ status: 'ready' } & InitializedTauriState)
  | ({ status: 'error'; error: InitializeTauriStateError });

const initialState = { status: 'idle' } as TauriState;

export const tauriSlice = createSlice({
  name: 'tauri',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeTauriState.pending, () => ({ status: 'loading' }))
      .addCase(initializeTauriState.fulfilled, (_, action) => ({
        status: 'ready',
        os: action.payload.os,
        app: action.payload.app,
      }))
      .addCase(initializeTauriState.rejected, (_, action) => ({
        status: 'error',
        error: action.payload ?? { kind: 'ApiFailed' },
      }));
  },
});

export const initializeTauriState = createAsyncThunk<
  InitializedTauriState,
  void,
  { state: RootState; rejectValue: InitializeTauriStateError }
>(`${tauriSlice.name}/initializeTauriState`, async (_, { rejectWithValue }) => {
  try {
    const osArch = await arch();
    const osPlatform = await platform();
    const osType = await type();
    const osVersion = await version();

    const appVersion = await getVersion();
    const tauriVersion = await getTauriVersion();

    return {
      os: {
        arch: osArch,
        platform: osPlatform,
        type: osType,
        version: osVersion,
      },
      app: {
        appVersion,
        tauriVersion,
      },
    };
  } catch (e) {
    return rejectWithValue({
      kind: 'ApiFailed',
      error: e,
    });
  }
});

export default tauriSlice.reducer;

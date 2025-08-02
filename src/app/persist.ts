import { appConfigDir, join } from '@tauri-apps/api/path';
import { readTextFile, writeTextFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { createAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import type { RootState } from './store';
import type { LocalPersistedState } from '../features/localSlice';
import type { TunnelPersistedState } from '../features/tunnelSlice';

const STATE_FILE = 'state.json';

const localSchema = z.object({
  game: z.string(),
  config: z.any(),
});

const tunnelSchema = z.object({
  tokenServer: z.string(),
});

const stateV1Schema = z.object({
  version: z.literal(1),
  local: localSchema.optional(),
  tunnel: tunnelSchema.optional(),
});

export type PersistedState = z.infer<typeof stateV1Schema>;
export type SliceKey = 'local' | 'tunnel';

export const hydrate = createAction<Partial<PersistedState>>('hydrate');

const schemas: Record<number, typeof stateV1Schema> = {
  1: stateV1Schema,
};

const getStateFilePath = async () => {
  const dir = await appConfigDir();
  await mkdir(dir, { recursive: true });
  return await join(dir, STATE_FILE);
};

export const loadState = async (keys: SliceKey[] = ['local', 'tunnel']): Promise<Partial<PersistedState> | null> => {
  try {
    const path = await getStateFilePath();
    if (await exists(path)) {
      const text = await readTextFile(path);
      const json = JSON.parse(text);
      const schema = schemas[json.version];
      if (!schema) {
        console.warn(`unknown state version: ${json.version}`);
        return null;
      }
      const parsed = schema.parse(json);
      const result: Partial<PersistedState> = {};
      if (keys.includes('local') && parsed.local) {
        result.local = parsed.local;
      }
      if (keys.includes('tunnel') && parsed.tunnel) {
        result.tunnel = parsed.tunnel;
      }
      return result;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const saveState = async (state: RootState, keys: SliceKey[] = ['local', 'tunnel']) => {
  try {
    const path = await getStateFilePath();
    const toSave: PersistedState = { version: 1 };
    if (keys.includes('local')) {
      toSave.local = {
        game: state.local.game,
        config: state.local.config,
      } as LocalPersistedState;
    }
    if (keys.includes('tunnel')) {
      toSave.tunnel = {
        tokenServer: state.tunnel.tokenServer,
      } as TunnelPersistedState;
    }
    await writeTextFile(path, JSON.stringify(toSave));
  } catch (e) {
    console.error(e);
  }
};

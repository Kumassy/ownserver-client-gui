import { appConfigDir, join } from '@tauri-apps/api/path';
import { readTextFile, writeTextFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { createAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import type { RootState } from './store';
import type { GameId } from '../common';

const STATE_FILE = 'state.json';

const localSchema = z.object({
  game: z.string() as z.ZodType<GameId>,
  config: z.any(),
});

const tunnelSchema = z.object({
  tokenServer: z.string(),
});

const stateV1Schema = z.object({
  version: z.literal(1),
  local: localSchema,
  tunnel: tunnelSchema,
});

export type PersistedState = z.infer<typeof stateV1Schema>;
export type SliceKey = 'local' | 'tunnel';

export const hydrate = createAction<PersistedState>('hydrate');

const schemas: Record<number, typeof stateV1Schema> = {
  1: stateV1Schema,
};

const getStateFilePath = async () => {
  const dir = await appConfigDir();
  await mkdir(dir, { recursive: true });
  return await join(dir, STATE_FILE);
};

export const loadState = async (): Promise<PersistedState | null> => {
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
      const { version, local, tunnel } = schema.parse(json);
      if (local && tunnel) {
        return {
          version,
          local,
          tunnel,
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const saveState = async (state: RootState) => {
  try {
    const path = await getStateFilePath();
    const toSave: PersistedState = {
      version: 1,
      local: {
        game: state.local.game,
        config: state.local.config,
      },
      tunnel: {
        tokenServer: state.tunnel.tokenServer,
      },
    };
    await writeTextFile(path, JSON.stringify(toSave));
  } catch (e) {
    console.error(e);
  }
};

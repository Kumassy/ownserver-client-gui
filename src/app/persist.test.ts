import localReducer from '../features/localSlice';
import tunnelReducer from '../features/tunnelSlice';
import { saveState, loadState, hydrate } from './persist';

jest.mock('@tauri-apps/api/path', () => ({
  appConfigDir: jest.fn(),
  join: jest.fn(),
}));

jest.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: jest.fn(),
  writeTextFile: jest.fn(),
  exists: jest.fn(),
  mkdir: jest.fn(),
}));

const pathApi = require('@tauri-apps/api/path');
const fsApi = require('@tauri-apps/plugin-fs');

describe('persist save/load', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('saveState and loadState work and status is reset on hydrate', async () => {
    // mock path functions
    (pathApi.appConfigDir as jest.Mock).mockResolvedValue('/config');
    (pathApi.join as jest.Mock).mockImplementation(async (dir: string, file: string) => `${dir}/${file}`);

    // mock fs operations with in-memory storage
    let stored: string | null = null;
    (fsApi.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fsApi.writeTextFile as jest.Mock).mockImplementation(async (_path: string, contents: string) => {
      stored = contents;
    });
    (fsApi.exists as jest.Mock).mockImplementation(async () => stored !== null);
    (fsApi.readTextFile as jest.Mock).mockImplementation(async () => stored);

    const mockState = {
      local: {
        game: 'minecraft',
        config: {
          minecraft: {
            endpoints: [],
            command: 'java aaa'
          }
        },
      },
      tunnel: {
        tokenServer: 'https://token.server',
      },
    } as any;

    await saveState(mockState);
    expect(fsApi.writeTextFile).toHaveBeenCalledWith('/config/state.json', expect.any(String));

    const loaded = await loadState();
    expect(loaded).not.toBeNull();
    expect(loaded?.local.game).toBe('minecraft');
    expect(loaded?.local.config.minecraft.command).toBe('java aaa');
    expect(loaded?.tunnel.tokenServer).toBe('https://token.server');

    // check status after hydrate
    const localState = localReducer(undefined, hydrate(loaded!));
    // items saved in the state file
    expect(localState.game).toBe('minecraft');
    expect(localState.config.minecraft.command).toBe('java aaa');
    // items not saved in the state file
    expect(localState.status).toBe('idle');

    const tunnelState = tunnelReducer(undefined, hydrate(loaded!));
    // items saved in the state file
    expect(tunnelState.tokenServer).toBe('https://token.server');
    // items not saved in the state file
    expect(tunnelState.tunnelStatus).toBe('idle');
  });
});

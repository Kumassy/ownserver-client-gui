import { getCheckList } from '../checks';
import reducer, { runCheck } from './localSlice'


describe('localSlice reducer', () => {
  test('should set checks for given game as initialState', async () => {
    const initialState = reducer(undefined, { type: '' })
    const checkList = getCheckList(initialState.game);

    expect(initialState.checks.map(check => check.id)).toStrictEqual(checkList)
  });


  test('should update check status by runCheck', async () => {
    const initialState = reducer(undefined, { type: '' })

    let state = {
      ...initialState,
      checks: [
        {
          id: 'CHECK_A',
          status: 'idle',
          message: ''
        },
        {
          id: 'CHECK_B',
          status: 'idle',
          message: ''
        },
        {
          id: 'CHECK_C',
          status: 'idle',
          message: ''
        },
      ]
    }

    const action = {
      type: runCheck.pending.type,
      meta: {
        arg: 'CHECK_B'
      }
    }
    state = reducer(state, action)

    expect(state.checks[1].status).toStrictEqual('running')
  });
})

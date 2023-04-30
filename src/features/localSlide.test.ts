import { getCheckList } from '../checks';
import reducer, { runCheck, LocalState } from './localSlice'


describe('localSlice reducer', () => {
  test('should update check status by runCheck', async () => {
    const initialState = reducer(undefined, { type: '' })

    let state: LocalState = {
      ...initialState,
      checks: [
        {
          id: 'CHECK_A',
          label: 'Check A',
          status: 'idle',
          message: ''
        },
        {
          id: 'CHECK_B',
          label: 'Check B',
          status: 'idle',
          message: ''
        },
        {
          id: 'CHECK_C',
          label: 'Check C',
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

import { handleActions } from 'redux-actions';

import { loginDone } from '../actions/login';

const INITIAL_STATE = {
  status: 'UNINITIALISED',
};

const handlers = {
  [loginDone]: (state, action) => ({
    ...state,
    status: 'INITIALISED',
    data: action.payload,
  }),
};

export default handleActions(handlers, INITIAL_STATE);

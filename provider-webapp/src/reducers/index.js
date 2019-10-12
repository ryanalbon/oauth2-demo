import { combineReducers } from 'redux';
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

const tokenReducer = handleActions(handlers, INITIAL_STATE);

const appReducer = combineReducers({
  token: tokenReducer,
});

export default appReducer;

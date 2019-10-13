import { handleActions } from 'redux-actions';

import { getNotesDone } from '../actions/notes';

const INITIAL_STATE = {
  status: 'UNINITIALISED',
};

const handlers = {
  [getNotesDone]: (state, action) => ({
    ...state,
    status: 'INITIALISED',
    data: action.payload,
  }),
};

export default handleActions(handlers, INITIAL_STATE);

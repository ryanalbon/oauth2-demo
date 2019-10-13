import { combineReducers } from 'redux';
import notesReducer from './notes-reducer';
import tokenReducer from './token-reducer';

export default combineReducers({
  notes: notesReducer,
  token: tokenReducer,
});

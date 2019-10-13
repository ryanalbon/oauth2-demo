import { all } from 'redux-saga/effects';

import createNoteSaga from './create-note-saga';
import getNotesSaga from './get-notes-saga';
import joinSaga from './join-saga';
import loginSaga from './login-saga';

function* appSaga() {
  yield all([
    createNoteSaga(),
    getNotesSaga(),
    joinSaga(),
    loginSaga(),
  ]);
}

export default appSaga;

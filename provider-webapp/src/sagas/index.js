import { all } from 'redux-saga/effects';

import joinSaga from './join-saga';
import loginSaga from './login-saga';

function* appSaga() {
  yield all([
    joinSaga(),
    loginSaga(),
  ]);
}

export default appSaga;

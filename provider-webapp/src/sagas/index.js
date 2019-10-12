import { all } from 'redux-saga/effects';

import joinSaga from './join-saga';

function* appSaga() {
  yield all([
    joinSaga(),
  ]);
}

export default appSaga;

import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { joinStart, joinDone } from '../actions/join';

function* joinSaga() {
  yield takeLatest(joinStart, function* ({ payload }) {
    const { email, password } = payload;
    const response = yield call(() => axios.post('/join', { email, password }));
    yield put(joinDone(response.data));
  });
}

export default joinSaga;

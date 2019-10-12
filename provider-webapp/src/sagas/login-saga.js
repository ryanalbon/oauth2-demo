import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { loginStart, loginDone } from '../actions/login';

function* loginSaga() {
  yield takeLatest(loginStart, function* ({ payload }) {
    const { email, password } = payload;
    const response = yield call(() => axios.post('/login', { email, password }));
    yield put(loginDone(response.data));
  });
}

export default loginSaga;

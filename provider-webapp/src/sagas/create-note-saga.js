import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { createNoteStart, createNoteDone } from '../actions/notes';

function* createNoteSaga() {
  yield takeLatest(createNoteStart, function* ({ payload }) {
    const token = yield select(state => state.token);
    const authorization = `Bearer ${token.data.access_token}`;
    const headers = { authorization };
    const response = yield call(() => axios.post('/api/v1/notes', { ...payload }, { headers }));
    yield put(createNoteDone(response.data));
  });
}

export default createNoteSaga;

import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { getNotesStart, getNotesDone } from '../actions/notes';

function* getNotesSaga() {
  yield takeLatest(getNotesStart, function* () {
    const token = yield select(state => state.token);
    const authorization = `Bearer ${token.data.access_token}`;
    const headers = { authorization };
    const response = yield call(() => axios.get('/api/v1/notes', { headers }));
    yield put(getNotesDone(response.data));
  });
}

export default getNotesSaga;

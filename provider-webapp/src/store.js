import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

import appSaga from './sagas';
import appReducer from './reducers';
import config from './config';

const persistConfig = {
  key: config.PERSIST_KEY,
  storage
};

const sagaMiddleware = createSagaMiddleware();

const persistentAppReducer = persistReducer(persistConfig, appReducer);

const store = createStore(
  persistentAppReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(appSaga);

const persistor = persistStore(store);

export { persistor, store };

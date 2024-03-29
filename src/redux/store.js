import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { CollapsedReducer } from './reducers/CollapsedReducer.js'
import { LoadingReducer } from './reducers/LoadingReducer.js'
import { UserInfoReducer } from './reducers/UserInfoReducer.js'
import { SearchReducer } from './reducers/SearchReducer.js'
import { SortReducer } from './reducers/SortReducer.js'



const rootReducer = combineReducers({
  Collapsed: CollapsedReducer,
  LoadingReducer,
  UserInfoReducer,
  SearchReducer,
  SortReducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['Collapsed'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
  ]
});

const persistor = persistStore(store);
export { store, persistor }
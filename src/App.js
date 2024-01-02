import React from 'react'
import { Provider } from 'react-redux'
import IndexRouter from './router/indexRouter'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  )
}


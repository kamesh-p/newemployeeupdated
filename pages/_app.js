// pages/_app.js
import React from 'react';
import { Provider } from 'react-redux';
import { store,persistor } from '../store';
import '../globals.css';
import { PersistGate } from "redux-persist/integration/react";
import Header from './header';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
        <Header/>

      <Component {...pageProps} />
       </PersistGate>
    </Provider>
  );
}

export default MyApp;

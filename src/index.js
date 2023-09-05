import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { initializeFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/messaging';
import App, { app } from './App';
import * as serviceWorker from './service-worker';
import './index.css';

// Enable Firestore database persistence so database can be queried/used offline
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  )
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-messaging';
import 'firebase/firestore';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PushNotifications from './PushNotifications';
import Authentication from './Authentication';

function App() {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  });

  firebase.firestore().enablePersistence()
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

  const render = () => {
      return (
        <div className="App">
          <Router>
            <Switch>
              <Route 
                exact={true}
                path="/"
                render={(props) => <Authentication />}
              />
              <Route 
                path="/notifications"
                render={(props) => <PushNotifications />}
              />
            </Switch>
          </Router>
        </div>
      );
  };

  return render();
}

export default App;

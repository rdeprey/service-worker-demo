import React, { useRef } from 'react';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import 'firebase/auth';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

export default function Authentication() {
    const loader = useRef(null);
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function() {
          // User successfully signed in.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          loader.current.style.display = 'none';
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: 'http://localhost:3000/notifications',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    };

    ui.start('#firebaseui-auth-container', uiConfig);

    return (
        <div>
            <AppBar position="static">
              <div className="wrapper">
                <Typography variant="h6">
                  Summer Reading List
                </Typography>
              </div>
            </AppBar>
            <h4>Sign in to get updates on the summer reading list.</h4>
            <div id="firebaseui-auth-container"></div>
            <div ref={loader}>Loading...</div>
        </div>
    );
}
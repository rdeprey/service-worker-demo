import React from 'react';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import 'firebase/auth';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

export default class Authentication extends React.Component {
    ui = new firebaseui.auth.AuthUI(firebase.auth());
    
    uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: 'http://localhost:3000/notifications',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    };

    render() {
        console.log(this.props);
        this.ui.start('#firebaseui-auth-container', this.uiConfig);

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
                <div id="loader">Loading...</div>
            </div>
        );
    }
}
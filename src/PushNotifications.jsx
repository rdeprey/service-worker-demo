import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-messaging';
import 'firebase/firestore';
import BookList from './BookList';
import UpdateNotificationBar from './UpdateNotificationBar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

export default class PushNotifications extends React.Component {
  pushBtn = null;

  constructor(props) {
      super(props);
      this.state = {
        isSubscribed: false,
        userToken: null,
        notificationMessage: '',
      };
  }

subscribeUser = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission not granted.');
      throw new Error('User isn\'t subscribed.');
    }

    const messagingToken = await firebase.messaging().getToken();
    if (messagingToken) {
      const docRef = await firebase.firestore().collection('device_ids').doc(messagingToken);

      const subscribedStatus = await docRef.get().then(async function(doc) {
          if (doc.exists) {
            console.log('Device already registered');
            localStorage.setItem('pushNotificationsKey', messagingToken);
            return Promise.resolve({success: true});
          }

          return await firebase.firestore().collection('device_ids').doc(messagingToken).set({
            id: messagingToken,
          }).then(() => {
            console.log('Device subscribed');
            localStorage.setItem('pushNotificationsKey', messagingToken);
            return Promise.resolve({success: true});
          })
          .catch(err => {
            console.log('There was an error subscribing the device: ', err);
          });
      });

      if (subscribedStatus.success) {
          this.setState({
            userToken: messagingToken,
            isSubscribed: true,
          });
          this.updateBtn();
        }
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    } catch(error) {
      if (error.code === "messaging/permission-blocked") {
          console.log("Please Unblock Notification Request Manually");
      } else {
          console.log("error Occurred", error);
      }
    };
  };

  unsubscribeUser = async () => {
    const deletedStatus = await firebase.messaging().deleteToken(this.state.userToken)
      .then(async () => {
        return await firebase.firestore().collection('device_ids').doc(this.state.userToken).delete().then(() => {
          console.log('Successfully deleted ' + this.state.userToken);
          return Promise.resolve({success: true});
        });
      })
      .catch(error => console.log('error unsubscribing: ', error));

      if (deletedStatus) {
        this.setState({
          isSubscribed: false,
          userToken: null,
        });
        localStorage.removeItem('pushNotificationsKey');
        this.updateBtn();
      }
  };

  updateBtn = () => {
    this.pushBtn.textContent = this.state.isSubscribed ? 'Unsubscribe' : 'Subscribe';
    this.pushBtn.disabled = false;
   }

  initializePush = () => {
    const userToken = localStorage.getItem('pushNotificationsKey');
    this.setState({
        userToken: userToken,
        isSubscribed: userToken !== null,
    });
    this.updateBtn();
  };

  handleClick = () => {
    if (this.state.isSubscribed) {
      return this.unsubscribeUser();
    }

    return this.subscribeUser();
  }

  render() {
    // Maintain 'this' reference within promise
    const that = this;

    // Once the DOM has loaded, check for service worker and push notification support
    // If both are supported, register the service worker
    document.addEventListener('DOMContentLoaded', () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          this.pushBtn = document.getElementById('pushBtn');

          navigator.serviceWorker.register('./firebase-messaging-sw.js')
            .then(function (registration) {
                firebase.messaging().useServiceWorker(registration);
                firebase.messaging().usePublicVapidKey("BDyyDVEkCAIyBGB6LvE5nTqo92qUXckjBuBS6pcD1-bZHAzXL551sH8XsGkSZkqMm7tpllWyG9HuZs561j25YgE");
                that.initializePush();
                console.log('Service worker is registered!');
            })
            .catch(function (error) {
                console.log('Service worker registration failed: ', error.message);
            });

            firebase.messaging().onMessage(payload => {
              this.setState({
                notificationMessage: payload.notification,
              });
            });
        } else {
            this.pushBtn.textContent = 'Push not supported.'
        }
    });

    // Render the UI
    return (
        <div>
          <AppBar position="static">
            <div className="wrapper">
              <Typography variant="h6">
                Summer Reading List
              </Typography>
              <Chip
                label="Subscribe"
                onClick={this.handleClick}
                id="pushBtn"
                color={this.state.isSubscribed ? "primary" : "secondary"}
              />
            </div>
          </AppBar>

          <BookList></BookList>

          <UpdateNotificationBar open={Object.entries(this.state.notificationMessage).length > 0  
            && this.state.notificationMessage.constructor === Object} message={this.state.notificationMessage}></UpdateNotificationBar>
        </div>
      );
  }
}
import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-messaging';
import 'firebase/firestore';
import BookList from './BookList';
import UpdateNotificationBar from './UpdateNotificationBar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';

export default function PushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notSupported, setNotSupported] = useState(false);

  // Handle subscribes to push notifications
  const subscribeUser = async () => {
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
            setIsSubscribed(true);
            setUserToken(messagingToken);
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

  // Handle unsubscribes from push notifications
  const unsubscribeUser = async () => {
    const deletedStatus = await firebase.messaging().deleteToken(userToken)
      .then(async () => {
        return await firebase.firestore().collection('device_ids').doc(userToken).delete().then(() => {
          console.log('Successfully deleted ' + userToken);
          return Promise.resolve({success: true});
        });
      })
      .catch(error => console.log('error unsubscribing: ', error));

      if (deletedStatus) {
        setIsSubscribed(false);
        setUserToken(null);
        localStorage.removeItem('pushNotificationsKey');
      }
  };

  // Set initial UI state
  const initializeUI = () => {
    const token = localStorage.getItem('pushNotificationsKey');
    setIsSubscribed(token !== null);
    setUserToken(token);
  };

  // Handle interactions with subscribe button
  const handleClick = () => {
    if (isSubscribed) {
      return unsubscribeUser();
    }

    return subscribeUser();
  };

  // Once the DOM has loaded, check for service worker and push notification support
  // If both are supported, register the service worker
  document.addEventListener('DOMContentLoaded', () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./firebase-messaging-sw.js')
          .then(function (registration) {
              firebase.messaging().useServiceWorker(registration);
              firebase.messaging().usePublicVapidKey("BDyyDVEkCAIyBGB6LvE5nTqo92qUXckjBuBS6pcD1-bZHAzXL551sH8XsGkSZkqMm7tpllWyG9HuZs561j25YgE");
              initializeUI();
              console.log('Service worker is registered!');
          })
          .catch(function (error) {
              console.log('Service worker registration failed: ', error.message);
          });

          firebase.messaging().onMessage(payload => {
            setNotificationMessage(payload.notification);
          });
      }

      if (!('PushManager' in window)) {
        setNotSupported(true);
      }
  });

  const subscribeBtnClassnames = classnames({
    'subscribe-button--hidden': notSupported
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
              label={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              onClick={handleClick}
              className={subscribeBtnClassnames}
              color={isSubscribed ? "primary" : "secondary"}
            />
          </div>
        </AppBar>

        <BookList></BookList>

        <UpdateNotificationBar open={Object.entries(notificationMessage).length > 0  
          && notificationMessage.constructor === Object} message={notificationMessage}></UpdateNotificationBar>
      </div>
    );
}
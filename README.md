# Push Notifications in a React App Using Firebase

A demo that illustrates how to configure service workers for push notifications in a React app using Google Firebase. This demo was created [as part of a presentation about using service workers to add push notifications and offline capabilities to web apps](https://rdeprey.github.io/Service-Workers-Presentation/#/).

## Running the App

### Configuring Firebase

To run this app yourself and try the demo, you'll need to do the following:

1. [Create a Firebase account](https://firebase.google.com/)
2. Create a file in the `src` directory called `firebaseConfig.js` that exports the Firebase config object from the Project Settings screen in the Firebase Console. Make sure that you have an `authDomain`, a `databaseUrl`, and a `messagingSenderId`.
3. Configure cloud messaging:

   - On the Project Settings screen in the Firebase Console, go to the Cloud Messaging tab.
   - In the Web Configuration section, create a Web Push certificate.
   - Copy the public key and export it from your `firebaseConfig.js` file as `firebaseMessagingPushNotificationsKey`

### Running the React App Locally

You can run the React app locally to try the demo. It's using React 18.

1. Run `npm i` in the root project directory
2. Run `npm run start` to start the application
3. Go to `http://localhost:3000` in your browser

You will need to enable push notifications for the localhost URL in your browser in order for the demo to work.

If you decide to host the application with Firebase Hosting, update the `.firebaserc` file to reference your project.

### Running the Firebase Cloud Function

The Cloud Function uses Node 18.

#### Run the Function Locally

To test the Firebase Function that sends the push notifications, you can [run the function locally](https://firebase.google.com/docs/functions/local-emulator).

#### Run the Function in the Cloud

_Alternatively,_ the Firebase Function can be deployed to Firebase for testing the push notifications.

1. Run `npm install -g firebase-tools` to install the Firebase Tools CLI
2. Run `firebase login` in your Terminal to login to your Firebase account via the CLI. (You might need to restart your Terminal for the command to be found after running step 1).
3. In the `functions` directory, run `npm i` to install the packages.
4. Also in the `functions` directory, run `npm run deploy` to deploy the function to Firebase Cloud Functions

**Note:** You will need at least the Blaze plan with Firebase to deploy and run the function.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Listens for changes to the books collection in Cloud Firestore
exports.sendBookNotification = functions.firestore.document('books/{title}').onWrite((change, context) => {
    const bookTitle = context.params.title;

    // Don't send a push notification when a book is deleted
    if (!change.after.exists) {
        return console.log(`Book ${bookTitle} was deleted.`);
    }

    const db = admin.firestore();

    // Get the device tokens to send push notifications to
    const deviceTokens = db.collection('device_ids')
        .get()
        .then(snapshots => {
            if (!snapshots) {
                return console.log('No devices to send to.');
            }

            // Create the push notification message
            const payload = {
                notification: {
                  title: 'New Book!',
                  body: `Check out '${bookTitle}'`,
                },
            };
            
            // Send push notifications to each subscribed device
            return snapshots.forEach(childSnapshot => {
                const token = childSnapshot.id;
                
                admin.messaging().sendToDevice(token, payload).then(response => {
                    response.results.forEach(result => {
                        // Send messages and log any errors delivering them
                        const error = result.error;
                      
                        if (error) {
                            console.error('Failed delivery to', token, error);

                            if (error.code === 'messaging/invalid-registration-token' ||
                                error.code === 'messaging/registration-token-not-registered') {

                                db.collection('device_ids').doc(childSnapshot.id).delete();
                                console.info('Was removed:', token)
                            } 

                            return;
                        }
                        
                        console.info('Notification sent to', token);
                    });
                    return;
                })
                .catch(err => {
                    console.log('Error sending to devices.' + err);
                });
            });
        })
        .catch(err => {
            console.log('Couldn\'t get the device tokens.' + err);
        });

    return deviceTokens;
});
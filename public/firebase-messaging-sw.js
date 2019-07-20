const CACHE_NAME = 'booklist-v1';
const urlsToCache = [
  'static/js/bundle.js',
  'static/js/0.chunk.js',
  'static/js/main.chunk.js',
  'favicon.ico',
  'offline.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }

      console.log('Network request for ', event.request.url);
      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      return caches.match('offline.html');
    })
  );
});

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '350496840151'
});

firebase.messaging().setBackgroundMessageHandler(payload => {
    const title = payload.data.title;
    const options = {
      body: payload.data.body,
    };
    return self.registration.showNotification(title, options);
  });
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PushNotifications from './PushNotifications';
import { firebaseConfig } from './firebaseConfig';
import './App.css';

export const app = initializeApp(firebaseConfig);

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (!authenticatedUser) {
      const auth = getAuth(app);
      signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
        setAuthenticatedUser({
          user: result.user,
          token: GoogleAuthProvider.credentialFromResult(result).accessToken
        });
      });
    }
  }, [authenticatedUser]);

  const render = () => {
    return (
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/' element={<PushNotifications />} />
          </Routes>
        </Router>
      </div>
    );
  };

  return render();
}

export default App;

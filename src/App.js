import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PushNotifications from './PushNotifications';
import Authentication from './Authentication';

function App() {
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

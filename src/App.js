import React, { Component } from 'react';
import './App.css';
import GetUserInformation from './components/GetUserInformation';
class App extends Component {
  render() {
    return (
      <div className="main-area">
        <div className="panel-white">
          <div className="panel-heading clearfix">
            <h3 className="panel-title">USERS ROLE MONITOR WIDGET</h3>
          </div>

          <div className="panel-body">
              <GetUserInformation />
          </div>
        </div>

      </div>
    );
  }
}

export default App;

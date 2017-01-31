import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import MeasurementDetails from './components/MeasurementDetails';

class Routes extends Component {
  render() {
    return(
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="country/:countryCode" component={MeasurementDetails} />
        </Route>
      </Router>
    );
  }
}

export default Routes;

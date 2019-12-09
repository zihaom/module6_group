import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';

import Logincontainer from './Login';
import Chatroomcontainer from './connectors';
import reducer from './reducer';

// Store
const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" component={Logincontainer} />
        <Route path="/Chatroom/" component={Chatroomcontainer}></Route>
    </Router>
  </Provider>,
  document.getElementById('main')
);

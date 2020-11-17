import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import MainLayout from './components/layout/MainLayout/MainLayout';

import HomePage from './components/views/Homepage/Homepage';
import Login from './components/views/Login/Login';
import Tables from './components/views/Tables/Tables';
import Waiter from './components/views/Waiter/Waiter';
import Kitchen from './components/views/Kitchen/Kitchen';

function App() {
  return (
  <BrowserRouter basename={'/panel'}>
    <MainLayout>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomePage} />
        <Route exact path={process.env.PUBLIC_URL + '/login'} component={Login} />
        <Route exact path={`${process.env.PUBLIC_URL}/tables`} component={Tables} />
        <Route exact path={`${process.env.PUBLIC_URL}/waiter`} component={Waiter} />
        <Route exact path={`${process.env.PUBLIC_URL}/kitchen`} component={Kitchen} />
      </Switch>
    </MainLayout>
  </BrowserRouter>
  );
}

export default App;

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import MainLayout from './components/layout/MainLayout/MainLayout';

import Homepage from './components/views/Homepage/Homepage';
import Login from './components/views/Login/Login';
import Tables from './components/views/Tables/Tables';
import Booking from './components/views/Booking/Booking';
import NewBooking from './components/views/NewBooking/NewBooking';
import Events from './components/views/Events/Events';
import NewEvents from './components/views/NewEvents/NewEvents';
import Waiter from './components/views/Waiter/Waiter';
import Order from './components/views/Order/Order';
import NewOrder from './components/views/NewOrder/NewOrder';
import Kitchen from './components/views/Kitchen/Kitchen';


class App extends React.Component {
	render(){
    return (
      <BrowserRouter>
            <MainLayout>
              <Switch>
                <Route exact path={`${process.env.PUBLIC_URL}/`} component={Homepage} />
                <Route exact path={process.env.PUBLIC_URL + '/login'} component={Login} />
                <Route exact path={process.env.PUBLIC_URL + '/tables'} component={Tables} />
                <Route exact path={process.env.PUBLIC_URL + '/tables/booking/book/:id'} component={Booking} />
								<Route exact path={process.env.PUBLIC_URL + '/tables/booking/new'} component={NewBooking} />
								<Route exact path={process.env.PUBLIC_URL + '/tables/events/event/:id'} component={Events} />
								<Route exact path={process.env.PUBLIC_URL + '/tables/events/new'} component={NewEvents} />
                <Route exact path={process.env.PUBLIC_URL + '/waiter'} component={Waiter} />
								<Route exact path={process.env.PUBLIC_URL + '/waiter/order/:id'} component={Order} />
								<Route exact path={process.env.PUBLIC_URL + '/order/new'} component={NewOrder} />
                <Route exact path={process.env.PUBLIC_URL + '/kitchen'} component={Kitchen} />
              </Switch>
            </MainLayout>
      </BrowserRouter>
		);
	}
}

export default App;

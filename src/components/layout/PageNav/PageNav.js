import React from 'react';
import {NavLink, Link} from 'react-router-dom';

const PageNav = () => (
	<nav>
		<NavLink exact to={`${process.env.PUBLIC_URL}/`} activeClassName='active'>Home</NavLink>
		<NavLink to={`${process.env.PUBLIC_URL}/login`} activeClassName='active'>Login</NavLink>
		<NavLink to={`${process.env.PUBLIC_URL}/tables`} activeClassName='active'>Tables</NavLink>
		<NavLink to={`${process.env.PUBLIC_URL}/waiter`} activeClassName='active'>Waiter</NavLink>
		<NavLink to={`${process.env.PUBLIC_URL}/kitchen`} activeClassName='active'>Kitchen</NavLink>
		<Link to={`${process.env.PUBLIC_URL}/tables/booking/book/:id`} activeClassName='active'>Booking</Link>
		<Link to={`${process.env.PUBLIC_URL}/tables/booking/new`} activeClassName='active'>New Booking</Link>
		<Link to={`${process.env.PUBLIC_URL}/tables/events/event/:id`} activeClassName='active'>Events</Link>
		<Link to={`${process.env.PUBLIC_URL}/tables/events/new`} activeClassName='active'>New Events</Link>
		<Link to={`${process.env.PUBLIC_URL}waiter/order/:id`} activeClassName='active'>Order</Link>
		<Link to={`${process.env.PUBLIC_URL}/order/new`} activeClassName='active'>New Order</Link>
	</nav>
);

export default PageNav;

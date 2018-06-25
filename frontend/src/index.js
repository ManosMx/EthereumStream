import React from 'react';
import ReactDOM from 'react-dom';

import { createBrowserHistory } from 'history';
import { Route, Switch } from 'react-router'; // react-router v4
import { ConnectedRouter } from 'connected-react-router';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';

import store from './store'
import drizzleOptions from './drizzleOptions'

import './index.css';
import App from './App';

const history = createBrowserHistory();

ReactDOM.render(
	<DrizzleProvider options={history}>
		<ConnectedRouter>
			<App />
		</ConnectedRouter>
	</DrizzleProvider>, 
	document.getElementById('root')
);
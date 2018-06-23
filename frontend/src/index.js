import React from 'react';
import ReactDOM from 'react-dom';

import { Drizzle, generateStore } from 'drizzle';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

/* Drizzle */
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from 'drizzle-react-components';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/* Import contracts */
import StreamToken from "./contracts/StreamToken.json";
import Streamer from "./contracts/Streamer.json";

const options = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:8545'
		}
	},
	contracts: [
		StreamToken,
		Streamer
	]
}

ReactDOM.render(
	<DrizzleProvider options={options}>
		<LoadingContainer>
			<App/>
		</LoadingContainer>
	</DrizzleProvider>,

	document.getElementById("root")
);
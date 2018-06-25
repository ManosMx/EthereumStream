import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Home extends Component {

	constructor(props, context) {
    	super(props);

		this.contracts = context.drizzle.contracts;
		this.factoryInvoke = this.factoryInvoke.bind(this);
		this.viewStreamers = this.viewStreamers.bind(this);
		this.isSubscriber = this.isSubscriber.bind(this);
		this.isStreamer = this.isStreamer.bind(this);

		this.state = {
			tokeName: '',
			tokenSymbol: '',
			tokenSupply: 0,
			tokenDecimals: 0,
			contractAddress: ''
		}
	}


	factoryInvoke(){
		this.state.contractAddress = this.contracts.StreamerFactory.method.deployStreamer(
			this.state.tokeName,
			this.state.tokenSymbol,
			this.state.tokenSupply,
			this.state.tokenDecimals).call();
	}


	viewStreamers(){
		this.contracts.StreamerFactory.method.returnDeployed().call();
	}


	isSubscriber(){

	}


	isStreamer(){

	}
}


Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home;
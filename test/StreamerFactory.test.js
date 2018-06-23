require('mocha');

const StreamerFactory = artifacts.require("./StreamerFactory.sol");


contract('StreamerFactory',function([owner,newstrm]){

	const name = "StrmToken";
	const symbol = "STC";
	const supply = 1000000;
	const decimals = 6;

	beforeEach(async function () {
		this.streamer = await StreamerFactory.new();
	});

	describe('factory shenanigans',function(){

		it('is correctly created', async function(){
			const value = await this.streamer.deployStreamer(name,symbol,supply,decimals,{from: newstrm});
		});

		it('returns a contract address array', async function(){
			const value = await this.streamer.returnDeployed({from: newstrm});
		});
	});
});
require('mocha');

const StreamToken = artifacts.require("./StreamToken.sol");
const Streamer = artifacts.require("./Streamer.sol");


contract('Streamer',function([owner,from,to]){

	const name = "StrmToken";
	const symbol = "STC";
	const supply = 1000000;
	const decimals = 6;

	beforeEach(async function () {
		this.streamer = await Streamer.new(name,symbol,supply,decimals);
	});

	describe('token giveaway utilities',function(){
		
		it('set ammount of token giveaway', async function(){
			const value = await this.streamer.setInitialSubToken(25)
		});

		it('only the streamer can set ammount', async function(){

			try{
				await this.streamer.setInitialSubToken(25,{ from: from })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});
	});


	describe('subscription operations',function(){
		
		it('set wei value of subscription', async function(){
			const value = await this.streamer.setSubscriptionCost(3)
		});

		it('only the streamer can set sub wei value', async function(){

			try{
				await this.streamer.setSubscriptionCost(1,{ from: from })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

		it('can subscribe with sufficient wei', async function(){
			const user = 'Manos';
			const value = await this.streamer.subscribe(user, { value: 1e+18, from: from })
		});

		it('cannot subscribe without enough wei', async function(){

			try{
				const user = 'Manos';
				const value = await this.streamer.subscribe(user, { value: 1, from: to })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

		it('can donate', async function(){

			const value = await this.streamer.donateToken('I can donate',10, { from: from })
		});

		it('can refund donation', async function(){

			const value = await this.streamer.requestRefund({ from: from })
		});

		it('can unsubscribe', async function(){

			const value = await this.streamer.unsubscribe({ from: from })
		});

		it('bans work', async function(){
			const user = 'Manos';
			await this.streamer.subscribe(user, { value: 1e+18, from: to })
			const value = await this.streamer.banSubscriber(to, { from: owner })
		});

	});

});
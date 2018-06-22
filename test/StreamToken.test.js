require('mocha');

const StreamToken = artifacts.require("./StreamToken.sol");


contract('StreamToken',function([owner,from,to]){

	const name = "StrmToken";
	const symbol = "STC";
	const supply = 1000000;
	const decimals = 6;

	beforeEach(async function () {
		this.token = await StreamToken.new(name,symbol,supply,decimals);
	});


	it('has a name', async function(){
		const t_name = await this.token.tokenName()
	});

	it('has a symbol', async function(){
		const t_symbol = await this.token.tokenSymbol()
	});

	it('has decimals', async function(){
		const t_decimals = await this.token.tokenDecimals()
	});

	it('has total supply', async function(){
		const t_supply = await this.token.totalSupply()
	});

	it('has account balance',async function(){
		const balance = await this.token.balanceOf(owner)
	});

	it('returns allowed tokens to spend',async function(){
		const allowed = await this.token.allowance(owner,to)
	});

	it('can approve spending',async function(){
		const approve = await this.token.approve(from,100,{from: owner})
	});	

	describe('transfer operation', function(){
		
		it('with sufficient account balance',async function(){
			const success = await this.token.transfer(to, 10, { from: owner })
		});

		it('reverts without sufficient account balance',async function(){

			try{
				await this.token.transfer(to, 10, { from: from })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

		it('reverts with invalid (0x0...) account',async function(){

			try{
				await this.token.transfer(0x0000000000000000000000000000000000000000, 10, { from: from })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

	});


	describe('transferFrom operation', function(){
		
		it('with sufficient allowed tokens',async function(){
			
			const approve = await this.token.approve(from,100,{from: owner})
			const success = await this.token.transferFrom(owner, to, 10, { from: from })
		});

		it('reverts without sufficient account balance',async function(){

			try{
				await this.token.transferFrom(to, owner, 10, { from: from })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

		it('reverts with invalid (0x0...) account',async function(){

			try{
				await this.token.transferFrom(0x0000000000000000000000000000000000000000,to, 10, { from: from })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

		it('reverts when allowance less than value',async function(){

			try{
				await this.token.transferFrom(owner, from, 10, { from: to })
				assert.fail()
			}
			catch(error){
				const isRevert = error.message.search('revert') >= 0;
    			assert(isRevert, `Expected "revert", got ${error} instead`);
			}
		});

	});
});
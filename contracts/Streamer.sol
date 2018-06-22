pragma solidity ^0.4.23;

//import "./utils/TokenDepository.sol";
import "./StreamToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/*
	Refunds are time restricted or
	authorized by the streamer.
*/
contract Streamer is Ownable{

	using SafeMath for uint256;

	StreamToken public _streamer_token;
	uint256 _subscription_wei;
	uint256 public _cost;
	uint256 public _subsciber_token;

	struct Subscriber{
		uint256 donation;	/* donations stay here for 24 hours */
		uint256 timer;
		string name;
		uint256 date;		/* date of subscription */
		uint256 duration;	/* measured in months */
	}

	mapping (address => Subscriber) public subscribers;


	constructor(string tokeName, string tokenSymbol, uint256 tokenSupply, uint256 tokenDecimals) public {
		owner = msg.sender;
		_streamer_token = new StreamToken(tokeName,tokenSymbol,tokenSupply,tokenDecimals);
		_cost = 2 wei;
		_subsciber_token = 50;
	}


	function setInitialSubToken(uint256 amount) onlyOwner public returns (uint256){	
		_subsciber_token = amount;
		return _subsciber_token;
	}


	function setSubscriptionCost(uint256 amount) onlyOwner public returns (uint256){	
		_cost = amount;	
		return _cost;
	}

	function subscribe(string username) public payable returns (bool){

		require(msg.value >= _cost);

		_subscription_wei.add(msg.value);
		Subscriber memory to_push = Subscriber(0, 0, username, now, msg.value);
		subscribers[msg.sender] = to_push;
		subscribers[msg.sender].duration.div(_cost).mul(2629743).add(now);

		_streamer_token.transfer(msg.sender,_subsciber_token);

		return true;
	}

	function getSubscriptionDate() public returns (uint256) {
		return subscribers[msg.sender].date;
	}

	function getSubscriptionExpires() public returns (uint256) {
		uint256 expires = subscribers[msg.sender].date;
		expires.add(subscribers[msg.sender].duration); 
		return expires;
	}

	function unsubscribe() public returns (bool){
		delete subscribers[msg.sender];
		return true;
	}

	function banSubscriber(address toBan) onlyOwner public returns (bool){
		require(toBan != address(0));
		delete subscribers[toBan];
		return true;
	}	

	function donate(uint256 amount) public returns (bool){

		require(_streamer_token.transfer(owner,amount) != false);
		require(subscribers[msg.sender].duration <= now);
		
		subscribers[msg.sender].donation = subscribers[msg.sender].donation.add(amount);
		subscribers[msg.sender].timer = block.timestamp;
		subscribers[msg.sender].timer.add(3600);
		
		return true;
	}

	function refund(address donator, uint256 value) internal returns (bool){

		require( donator != owner );

		_streamer_token.transfer(donator,value);

		return true;
	}


	function requestRefund() public returns (bool){

		require( subscribers[msg.sender].timer < now);

		refund(msg.sender,subscribers[msg.sender].donation);

		subscribers[msg.sender].donation = 0;

		return true;
	}
}
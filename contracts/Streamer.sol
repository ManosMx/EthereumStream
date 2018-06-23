pragma solidity ^0.4.23;


import "./StreamToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/*
 *	@Title: Streamer
 *	
 *	@dev: Streamer is a basic a base contract for managing subscribers, having your own token
 *		  and running donations through your ERC-20 token. When someone subscribes to the Streamer
 *		  a certain amount of token is given to the subscriber which is later used for donations.
 *		  Donation can be refunded, under the condition that < 24 hours have passed since the donation.
 *		  Subscription is also time based, with the base subscription value bying 31 days.		
 */
contract Streamer is Ownable{

	using SafeMath for uint256;

	StreamToken public _streamer_token; /* Streamer is the owner and distributor of the token he constructs */
	uint256 _subscription_wei;			/* wei raised from subscriptions */
	uint256 public _cost;				/* amount of wei a subscription costs */
	uint256 public _subsciber_token;	/* StreamToken to be transfered for a new subscription */

	struct Subscriber{
		uint256 donation;	/* donation amount */
		uint256 timer;		/* timer for donation; checked when someone requests refund */
		uint256 date;		/* date of subscription */
		uint256 expiration;	/* date the subscription expires */
		string message;		/* donation message */
		string name;		/* subscribers username */
	}

	mapping (address => Subscriber) public subscribers;



	constructor(
		string tokeName, 
		string tokenSymbol, 
		uint256 tokenSupply, 
		uint256 tokenDecimals) public {
		
		owner = msg.sender;
		_streamer_token = new StreamToken(tokeName,tokenSymbol,tokenSupply,tokenDecimals);
		_cost = 2 wei;
		_subsciber_token = 50;
	}


	/*
	 *	@param amount The amount of tokens someone receives upon subscription.
	 *
	 */
	function setInitialSubToken(uint256 amount) onlyOwner public returns (uint256){	
		_subsciber_token = amount;
		return _subsciber_token;
	}


	/*
	 *	@param amount How many Wei a subscription costs.
	 *
	 */
	function setSubscriptionCost(uint256 amount) onlyOwner public returns (uint256){	
		_cost = amount;	
		return _cost;
	}


	/*
	 *	@param subscriber The address of the subscriber.
	 *
	 */
	function getSubscriberName(address subscriber) public returns (string){
		require(subscriber != address(0));
		return subscribers[subscriber].name;
	} 


	/*
	 *	@param subscriber The address of the subscriber.
	 *
	 */
	function getDonationMsg(address subscriber) public returns (string) {
		require(subscriber != address(0));
		return subscribers[subscriber].message;
	}


	/*
	 *	@dev: Subscription function requires a _cost amount of wei for someone to
	 *		  subscribe, calculates the date of expiration for the subscription
	 *		  and transfers _subsciber_token to the new subscriber.
	 *
	 *	@param name The username of the subscriber.
	 */
	function subscribe(string name) public payable returns (bool) {

		require(msg.value >= _cost);
		require(subscribers[msg.sender].expiration <= now);

		_subscription_wei.add(msg.value);
		Subscriber memory to_push = Subscriber(0, 0, now, msg.value,"",name);
		subscribers[msg.sender] = to_push;
		subscribers[msg.sender].expiration.div(_cost).mul(2629743).add(now);

		_streamer_token.transfer(msg.sender,_subsciber_token);

		return true;
	}



	function getSubscriptionDate() public returns (uint256) {
		return subscribers[msg.sender].date;
	}



	function getSubscriptionExpires() public returns (uint256) {
		uint256 expires = subscribers[msg.sender].date;
		expires.add(subscribers[msg.sender].expiration); 
		return expires;
	}



	function unsubscribe() public returns (bool) {
		delete subscribers[msg.sender];
		return true;
	}


	/*
	 *	@param toBan The address of the subscriber.
	 *
	 */
	function banSubscriber(address toBan) onlyOwner returns (bool) {
		require(toBan != address(0));
		delete subscribers[toBan];
		return true;
	}	



	/*
	 *	@param message The donation message.
	 * 	@param amount The amount of token to donate.
	 *
	 */
	function donateToken(string message, uint256 amount) external returns (bool) {
		require(_streamer_token.transfer(owner,amount) != false);
		require(subscribers[msg.sender].expiration <= now);
		require(subscribers[msg.sender].expiration > 0);

		subscribers[msg.sender].donation = subscribers[msg.sender].donation.add(amount);
		subscribers[msg.sender].timer = block.timestamp;
		subscribers[msg.sender].timer.add(3600);
		subscribers[msg.sender].message = message;
		
		return true;
	}



	/*
	 *	@dev: Refund utility (as the refund transfer needs to come from the owner).
	 *		  Can't be used out of this contract. 
	 *
	 *	@param donator Donators address.
	 * 	@param value The amount of token to refund.
	 *
	 */
	function refund(address donator, uint256 value) private returns (bool) {

		require( donator != owner );

		_streamer_token.transfer(donator,value);

		return true;
	}



	function requestRefund() external returns (bool) {
		require( subscribers[msg.sender].timer < now);

		refund(msg.sender,subscribers[msg.sender].donation);

		subscribers[msg.sender].donation = 0;

		return true;
	}
}
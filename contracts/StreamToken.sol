pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract StreamToken is ERC20{

	using SafeMath for uint256;

	address public _owner;
	string public _token_name;
    string public _token_symbol;
    uint256 public _total_supply;
    uint256 public _decimals;

    mapping (address => uint256) _accounts_balance;
    mapping (address => mapping (address => uint256)) internal _allowed;

    constructor(string name, string symbol, uint256 supply, uint256 decimals) public {
    	_owner = msg.sender;
    	_accounts_balance[_owner] = supply;
    	_token_name = name;
		_token_symbol = symbol;
		_total_supply = supply;
		_decimals = decimals;
    }

    function tokenName() public view returns (string){
    	return _token_name;
    }

    function tokenSymbol() public view returns (string){
    	return _token_symbol;
    }

	function tokenDecimals() public view returns (uint256){
    	return _decimals;
    }    

    /* From ECR20 interface (just implement) */
    function totalSupply() public view returns (uint256){
    	return _total_supply;
    }

	function balanceOf(address who) public view returns (uint256){
		return _accounts_balance[who];
	}

	/*
		Transfers _value amount of tokens to address _to, and MUST fire the Transfer event.
		The function SHOULD throw if the _from account balance does not have enough tokens to spend.
		Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.
	*/
	function transfer(address to, uint256 value) public returns (bool){
	
		require(value <= _accounts_balance[msg.sender]);	// check if sender has the amount to send
		require(to != address(0));

		// Commit the transaction
		_accounts_balance[msg.sender] = _accounts_balance[msg.sender].sub(value);
		_accounts_balance[to] = _accounts_balance[to].add(value);

		// Emit the transfer event to the blockchain
		emit Transfer(msg.sender,to,value);

		return true;
	}
    
    /*
    	Returns the amount which _spender is still allowed to withdraw from _owner.
	*/
    function allowance(address owner, address spender) public view returns (uint256){

    	return _allowed[owner][spender];
    }

    /*
		Transfers _value amount of tokens from address _from to address _to, and MUST fire the Transfer event.
		The transferFrom method is used for a withdraw workflow, allowing contracts to transfer tokens on your behalf.
		This can be used for example to allow a contract to transfer tokens 
		on your behalf and/or to charge fees in sub-currencies. 
		The function SHOULD throw unless the _from account has deliberately authorized the sender of the message via some mechanism.
		
		Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.

    */
	function transferFrom(address from, address to, uint256 value) public returns (bool){
		
		require(to != address(0));
		require(to != from);	// avoid token cycling
		require(value <= _accounts_balance[from]);
		require(value <= _allowed[from][msg.sender]);

		// Decrease the allowance
		_allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);

		// Commit the transaction
		_accounts_balance[from] = _accounts_balance[from].sub(value);
		_accounts_balance[to] = _accounts_balance[to].add(value);

		// Emit the relevant event to the blockchain
		emit Transfer(from,to,value);

		return true;
	}

	/*
		Allows _spender to withdraw from your account multiple times, up to the _value amount. 
		If this function is called again it overwrites the current allowance with _value.

		NOTE: To prevent attack vectors like the one described here and discussed here, 
		clients SHOULD make sure to create user interfaces in such a way that 
		they set the allowance first to 0 before setting it to another value for the same spender. 
		THOUGH The contract itself shouldn't enforce it, 
		to allow backwards compatibility with contracts deployed before
	*/
	function approve(address spender, uint256 value) public returns (bool){
		
		_allowed[msg.sender][spender] = 0;		// set to 0 as advised
		_allowed[msg.sender][spender] = value;

		emit Approval(msg.sender,spender,value);

		return true;
	}

	/*
		event Transfer(address indexed from, address indexed to, uint256 value);

		MUST trigger when tokens are transferred, including zero value transfers.
		A token contract which creates new tokens SHOULD trigger a Transfer event with the _from address 
		set to 0x0 when tokens are created.
	*/


	/*
		event Approval(address indexed owner, address indexed spender, uint256 value);

		MUST trigger on any successful call to approve(address _spender, uint256 _value).
	*/
}
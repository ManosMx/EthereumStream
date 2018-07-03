pragma solidity ^0.4.23;


import "./Streamer.sol";


contract StreamerFactory {

	address[] public _deployedStreamers;

	function deployStreamer(
		string tokeName, 
		string tokenSymbol, 
		uint256 tokenSupply, 
		uint256 tokenDecimals) public returns (address) {

		Streamer newStreamer = new Streamer(tokeName,tokenSymbol,tokenSupply,tokenDecimals);
		
		// otherwise owner is gonna be the Factory contract
		newStreamer.transferOwnership(msg.sender);
		
		_deployedStreamers.push(newStreamer);

		return newStreamer;
	}


	function returnDeployed() public view returns (address[]) {
		return _deployedStreamers;
	}

}
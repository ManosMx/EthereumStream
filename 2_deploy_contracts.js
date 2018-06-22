var StreamToken = artifacts.require("./StreamToken.sol");
var Streamer = artifacts.require("./Streamer.sol");

module.exports = function(deployer) {
  deployer.deploy(StreamToken);
  deployer.deploy(Streamer);
};
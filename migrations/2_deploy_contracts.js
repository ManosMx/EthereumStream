var StreamerFactory = artifacts.require("./StreamerFactory");
var Streamer = artifacts.require("./Streamer");

module.exports = function(deployer) {
  deployer.deploy(StreamerFactory);
};
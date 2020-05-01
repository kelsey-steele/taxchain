const TaxChain = artifacts.require("TaxChain");

module.exports = function(deployer) {
  deployer.deploy(TaxChain);
};

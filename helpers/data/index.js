const { getEOAAccountsPrivateKeys, getEOAAccountsPublicKeys } = require("./accounts")
const { preDeployedContracts } = require("./preDeployedContracts")
const { addresses } = require("./contractAddresses")
const { getNetworkConfig } = require("./networks")

module.exports = { getEOAAccountsPrivateKeys, getEOAAccountsPublicKeys, preDeployedContracts, addresses, getNetworkConfig };
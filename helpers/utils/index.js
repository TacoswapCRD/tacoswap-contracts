const { getEOAAccountsPrivateKeys } = require("../data")

const INFURA_API_KEY = process.env.INFURA_API_KEY || '';

function getNamedAccountsConfig(index, publicKeyAddress) {
    if (typeof (publicKeyAddress) == "undefined") {
        return { default: index }
    }
    return {
        default: index,
        "rinkeby": publicKeyAddress,
        "kovan": publicKeyAddress,
        "ropsten": publicKeyAddress,
        "goerli": publicKeyAddress
    }
}

function getNetworkConfig(network, chainId) {
    eoaAccountsPrivateKeys = getEOAAccountsPrivateKeys()

    return {
        url: `https://` + network + `.infura.io/v3/` + INFURA_API_KEY,
        accounts: eoaAccountsPrivateKeys,
        chainId: chainId,
        live: true,
        saveDeployments: true,
        tags: ["staging"],
        gasPrice: 5000000000,
        gasMultiplier: 2,
    }
}

module.exports = { getNamedAccountsConfig }
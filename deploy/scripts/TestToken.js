const { eConfig, contractDeploy } = require("../utils")

module.exports = async function (hre) {
    const { IS_UPGRADE, IS_PROXY, UPGRADEABLE_PROXY_ADDRESS } = await eConfig();

    const options = {
        contractName: "TestToken",
        isUpgrade: IS_UPGRADE,
        isProxy: IS_PROXY,
        upgradeableProxyAddress: UPGRADEABLE_PROXY_ADDRESS
    }

    await contractDeploy(hre, options)
}
module.exports.tags = ["TestToken"]
module.exports.dependencies = []

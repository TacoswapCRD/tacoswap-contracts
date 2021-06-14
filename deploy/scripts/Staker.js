const { eConfig, contractDeploy } = require("../utils")

module.exports = async function (hre) {
    const { IS_UPGRADE, IS_PROXY, UPGRADEABLE_PROXY_ADDRESS } = await eConfig();

    const options = {
        contractName: "Staker",
        isUpgrade: IS_UPGRADE,
        isProxy: IS_PROXY,
        upgradeableProxyAddress: UPGRADEABLE_PROXY_ADDRESS
    }

    await contractDeploy(hre, options)
}
module.exports.tags = ["Staker"]
module.exports.dependencies = ["UTacoChef"];

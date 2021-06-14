const { ethers } = require("hardhat");
const { eConfig, contractDeploy } = require("../utils")

module.exports = async function (hre) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts()
    const { IS_UPGRADE, IS_PROXY, UPGRADEABLE_PROXY_ADDRESS } = await eConfig();

    const utacochef = await ethers.getContract("UTacoChef");

    const pToken = await deploy("PToken", {
        from: deployer,
        contract: "ERC20Mock",
        args: ["PToken", "PT", ethers.utils.parseEther("1000")],
        log: true,
        deterministicDeployment: false
    })

    const options = {
        contractName: "Staker",
        isUpgrade: IS_UPGRADE,
        isProxy: IS_PROXY,
        args: [utacochef.address, pToken.address],
        upgradeableProxyAddress: UPGRADEABLE_PROXY_ADDRESS
    }

    await contractDeploy(hre, options)
}
module.exports.tags = ["Staker"]
module.exports.dependencies = ["UTacoChef"];

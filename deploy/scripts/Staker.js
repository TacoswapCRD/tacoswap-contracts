const { ethers } = require("hardhat");
const { eConfig, contractDeploy } = require("../utils")

module.exports = async function (hre) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts()
    // const { IS_UPGRADE, IS_PROXY, UPGRADEABLE_PROXY_ADDRESS } = await eConfig();

    // const etacochef = await ethers.getContract("eTacoChef");

    const pToken = await deploy("TacoLockToken", {
        from: deployer,
        contract: "ERC20Mock",
        args: ["TacoLockToken", "TLT", ethers.utils.parseEther("1000")],
        log: true,
        deterministicDeployment: false
    })

    await deploy("TacoLocker", {
        from: deployer,
        args: ["0x7F7710e0c7C5C0FF043963dd22C3988e8bDb7AcC", pToken.address],
        log: true,
        deterministicDeployment: false
    })
}
module.exports.tags = ["Staker"]
module.exports.dependencies = [];

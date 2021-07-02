const { ethers } = require("hardhat");
const { eConfig, contractDeploy } = require("../utils")
module.exports = async function (hre) {
  const { IS_UPGRADE, IS_PROXY, UPGRADEABLE_PROXY_ADDRESS } = await eConfig();

  const START_BLOCK = 10958800;

  const etaco = await ethers.getContract("eTacoToken")

  const options = {
    contractName: "eTacoChef",
    isProxy: IS_PROXY,
    isUpgrade: IS_UPGRADE,
    args: [etaco.address, ethers.utils.parseEther("90"), START_BLOCK],
    upgradeableProxyAddress: UPGRADEABLE_PROXY_ADDRESS
  }

  await contractDeploy(hre, options)
}

module.exports.tags = ["eTacoChefV2"]
// module.exports.dependencies = ["eTacoToken", "TacoswapV2Router02"]
module.exports.dependencies = []

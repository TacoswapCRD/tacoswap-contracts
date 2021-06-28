const { getNamedAccounts, ethers } = require("hardhat");
const { eConfig, contractDeploy } = require("../utils")
module.exports = async function (hre) {
  const { IS_UPGRADE, IS_PROXY, UPGRADEABLE_PROXY_ADDRESS } = await eConfig();

  const signer = await ethers.getSigners()
  console.log(signer[1].address);
  const mainOwner = "0x35700c4a7BD65048f01D6675F09d15771c0fAcd5"

  const etaco = await ethers.getContract("eTacoToken")
  const router = await ethers.getContract("TacoswapV2Router02")
  const provider = await ethers.getContractAt("ILiquidityProvider", "0x5460CD29415F811dd9dD5BeD52aA1a56a5bac181");

  let blockNumber = await ethers.provider.getBlockNumber()

  const options = {
    contractName: "eTacoChef",
    isUpgrade: IS_UPGRADE,
    isProxy: IS_PROXY,
    args: [etaco.address, mainOwner, ethers.utils.parseEther("10"), blockNumber + 100, blockNumber + 200],
    upgradeableProxyAddress: UPGRADEABLE_PROXY_ADDRESS
  }

  await contractDeploy(hre, options, async (contract) => {
    if(await getChainId() == 31337){
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x35700c4a7BD65048f01D6675F09d15771c0fAcd5"]
    })

    await signer[0].sendTransaction({ value: ethers.utils.parseEther("1"), to: "0x35700c4a7BD65048f01D6675F09d15771c0fAcd5" })

    const providerOwner = await ethers.provider.getSigner("0x35700c4a7BD65048f01D6675F09d15771c0fAcd5")
    const tx = await provider.connect(providerOwner).populateTransaction.addExchange(router.address);
    await providerOwner.sendTransaction(tx);

    const tx1 = await provider.connect(providerOwner).populateTransaction.addExchange("0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F");
    await providerOwner.sendTransaction(tx1);

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: ["0x35700c4a7BD65048f01D6675F09d15771c0fAcd5"]
    });

    const apiID = 1;

    await contract.connect(signer[1]).setProvider("0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F")
    await  contract.connect(signer[1]).setApi(apiID)
  }

  })
}

module.exports.tags = ["eTacoChef"]
module.exports.dependencies = ["eTacoToken", "TacoswapV2Router02"]

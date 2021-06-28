const { WETH } = require("@sushiswap/sdk")

module.exports = async function ({ ethers: { getNamedSigner }, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, owner } = await getNamedAccounts()

  const chainId = await getChainId()

  const factory = await ethers.getContract("TacoswapV2Factory")
  const bar = await ethers.getContract("eTacoBar")
  const etaco = await ethers.getContract("eTacoToken")
  
  let wethAddress;
  
  if (chainId === '31337') {
    wethAddress = (await deployments.get("WETH9Mock")).address
  } else if (chainId in WETH) {
    wethAddress = WETH[chainId].address
  } else {
    throw Error("No WETH!")
  }

  await deploy("eTacoMaker", {
    from: deployer,
    args: [factory.address, bar.address, etaco.address, wethAddress],
    log: true,
    deterministicDeployment: false
  })

  const maker = await ethers.getContract("eTacoMaker")
  if (await maker.owner() !== owner) {
    console.log("Setting maker owner")
    await (await maker.transferOwnership(owner, true, false)).wait()
  }
}

module.exports.tags = ["eTacoMaker"]
module.exports.dependencies = ["eTacoBar"]
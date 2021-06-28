module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy('TacoswapV2Factory', {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  })
}

module.exports.tags = ["TacoswapV2Factory", "DEX"]

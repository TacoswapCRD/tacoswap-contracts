module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer, holder } = await getNamedAccounts()
  
    await deploy("UTacoToken", {
      from: deployer,
      args: [holder],
      log: true,
      deterministicDeployment: false
    })
  }
  
  module.exports.tags = ["UTacoToken"]
  module.exports.dependencies = ["TacoswapV2Router02"]
  
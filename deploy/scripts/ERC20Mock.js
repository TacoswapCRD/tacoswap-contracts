module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer } = await getNamedAccounts()
  
    await deploy("ERC20Mock", {
      from: deployer,
      args: ["TokenA", "TA", "100000000000"],
      log: true,
      deterministicDeployment: false
    })
  }
  
  module.exports.tags = ["ERC20Mock"]
  module.exports.dependencies = []
  
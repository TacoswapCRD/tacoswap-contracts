module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer } = await getNamedAccounts()
  
    await deploy("eTacoToken", {
      from: deployer,
      args: [],
      log: true,
      deterministicDeployment: false
    })
  }
  
  module.exports.tags = ["eTacoToken"]
  module.exports.dependencies = []
  

module.exports = async function ({ ethers, getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer } = await getNamedAccounts()
  
    const taco = await ethers.getContract("ERC20Mock")
    const etaco = await  ethers.getContract("eTacoToken");
  
    await deploy("TacoToETaco", {
      from: deployer,
      args: [taco.address, etaco.address],
      log: true,
    })
  }
  
  module.exports.tags = ["TacoToETaco"]
  module.exports.dependencies = ["eTacoToken"]
  
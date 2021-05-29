
module.exports = async function ({ ethers, getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer } = await getNamedAccounts()
  
    const taco = await ethers.getContract("ERC20Mock")
    const utaco = await  ethers.getContract("UTacoToken");
  
    await deploy("TacoToUTaco", {
      from: deployer,
      args: [taco.address, utaco.address],
      log: true,
    })
  }
  
  module.exports.tags = ["TacoToUTaco"]
  module.exports.dependencies = ["test", "UTacoToken"]
  
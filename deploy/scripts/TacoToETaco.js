
module.exports = async function ({ ethers, getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer } = await getNamedAccounts()
  
    // const taco = await ethers.getContract("ERC20Mock")
    const TACO_ADDRESS = "0x41C028a4C1F461eBFC3af91619b240004ebAD216";
    const etaco = await  ethers.getContract("eTacoToken");
  
    await deploy("TacoToETaco", {
      from: deployer,
      args: [TACO_ADDRESS, etaco.address],
      log: true,
    })
  }
  
  module.exports.tags = ["TacoToETaco"]
  module.exports.dependencies = ["eTacoToken"]
  
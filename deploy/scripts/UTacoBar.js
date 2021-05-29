module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const utaco = await deployments.get("UTacoToken")

  await deploy("UTacoBar", {
    from: deployer,
    args: [utaco.address],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["UTacoBar"]
module.exports.dependencies = ["UTacoToken"]

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const etaco = await deployments.get("eTacoToken")

  await deploy("eTacoBar", {
    from: deployer,
    args: [etaco.address],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["eTacoBar"]
module.exports.dependencies = ["eTacoToken"]

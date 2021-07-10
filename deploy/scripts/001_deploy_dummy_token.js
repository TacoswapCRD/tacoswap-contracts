module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("DummyToken", {
    from: deployer,
    args: [
    ],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["MigratorOld"]
module.exports.dependencies = []

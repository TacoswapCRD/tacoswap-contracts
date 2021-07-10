module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("MigratorOldChef", {
    from: deployer,
    args: [
      "0x7F7710e0c7C5C0FF043963dd22C3988e8bDb7AcC",
    ],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["MigratorOld"]
module.exports.dependencies = []

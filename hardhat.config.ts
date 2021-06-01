// hardhat.config.ts

import "dotenv/config"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-solpp"
import "@nomiclabs/hardhat-solhint"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import "@openzeppelin/hardhat-upgrades"
import "@tenderly/hardhat-tenderly"
import "hardhat-ethernal"
import "hardhat-typechain";
import "hardhat-spdx-license-identifier"
import "hardhat-abi-exporter"
import "hardhat-contract-sizer"
import "hardhat-docgen"
import "hardhat-watcher"
import "solidity-coverage"
import "hardhat-gas-reporter"
import "@symfoni/hardhat-react";
import "hardhat-dependency-compiler";
import "@typechain/ethers-v5";
import "hardhat-etherscan-abi";
import "hardhat-tracer";
import { HardhatUserConfig } from "hardhat/types"
import { removeConsoleLog } from "hardhat-preprocessor"


import "./tasks";
import { getEOAAccountsPublicKeys, preDeployedContracts, getNamedAccountsConfig, getNetworkConfig } from "./helpers";

const eoaAccountsPublicKeys = getEOAAccountsPublicKeys();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT || '';
const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME || '';
const IS_GAS_REPORTER_ENABLED = process.env.IS_GAS_REPORTER_ENABLED === "true";
const IS_PROXY = process.env.IS_PROXY === "true";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    mainnet: getNetworkConfig("mainnet"),
    localhost: getNetworkConfig("localhost"),
    hardhat: getNetworkConfig("hardhat"),
    ropsten: getNetworkConfig("ropsten"),
    rinkeby: getNetworkConfig("rinkeby"),
    goerli: getNetworkConfig("goerli"),
    kovan: getNetworkConfig("kovan"),
    moonbase: getNetworkConfig("moonbase"),
    arbitrum: getNetworkConfig("arbitrum"),
    fantom: getNetworkConfig("fantom"),
    "fantom-testnet": getNetworkConfig("fantom-testnet"),
    matic: getNetworkConfig("matic"),
    mumbai: getNetworkConfig("mumbai"),
    xdai: getNetworkConfig("xdai"),
    bsc: getNetworkConfig("bsc"),
    "bsc-testnet": getNetworkConfig("bsc-testnet"),
    heco: getNetworkConfig("heco"),
    "heco-testnet": getNetworkConfig("heco-testnet"),
    avalanche: getNetworkConfig("avalanche"),
    fuji: getNetworkConfig("fuji"),
    harmony: getNetworkConfig("harmony"),
    "harmony-testnet": getNetworkConfig("harmony-testnet"),
  },
  namedAccounts: {
    deployer: getNamedAccountsConfig(0, eoaAccountsPublicKeys[0]),
    owner: getNamedAccountsConfig(1, eoaAccountsPublicKeys[1]),
    caller: getNamedAccountsConfig(2, eoaAccountsPublicKeys[2]),
    holder: getNamedAccountsConfig(3, eoaAccountsPublicKeys[3]),
    vzgo: getNamedAccountsConfig(4, eoaAccountsPublicKeys[4]),
    grno: getNamedAccountsConfig(5, eoaAccountsPublicKeys[5]),
    toni: getNamedAccountsConfig(6),
    chugun: getNamedAccountsConfig(7),
    bob: getNamedAccountsConfig(8)
  },
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy/scripts",
    deployments: "frontend/src/hardhat/deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  preprocess: {
    eachLine: removeConsoleLog((bre) => bre.network.name !== "hardhat" && bre.network.name !== "localhost"),
  },
  solpp: {
    defs: {
      "IS_PROXY": IS_PROXY,
    }
  },
  tenderly: {
    project: TENDERLY_PROJECT!,
    username: TENDERLY_USERNAME!,
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  abiExporter: {
    path: "./abi",
    clear: false,
    flat: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: false,
  },
  dependencyCompiler: {
    paths: [
      '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol',
      '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol',
      '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol'
    ],
    keep: false
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
  gasReporter: {
    coinmarketcap: COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: IS_GAS_REPORTER_ENABLED,
    remoteContracts: preDeployedContracts
    // src: "./cache/solpp-generated-contracts/",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 20000,
  },
}

export default config

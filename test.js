const d = require('./artifacts/cache/solpp-generated-contracts/tacoswapv2/TacoswapV2Pair.sol/TacoswapV2Pair.json');
const { keccak256 } = require('@ethersproject/solidity');

console.log(d);


const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [`${d.bytecode}`])
console.log(COMPUTED_INIT_CODE_HASH);

import { BigNumber } from '../utaco'
import useFarms from './useFarms'

const usePrice = (lpTokenName: { [0]: string; [1]: string }, farmId?: string) => {
  const { stakedValue, farms } = useFarms()
  const currentFarmIndex = farms.findIndex(farm => farm.id === farmId)
  const BLOCKS_PER_YEAR = new BigNumber(2336000)
  const COMB_PER_BLOCK = new BigNumber(0.006153230765385)

  const sushiIndex = farms.findIndex(({ lpToken }) => lpToken === lpTokenName[0])

  const usdtIndex = farms.findIndex(({ lpToken }) => lpToken === lpTokenName[1])

  const price = sushiIndex >= 0 && stakedValue[sushiIndex] ? stakedValue[sushiIndex].tokenPriceInWeth : new BigNumber(0)

  const etherPrice =
    usdtIndex >= 0 && stakedValue[usdtIndex]
      ? new BigNumber(1).div(stakedValue[usdtIndex].tokenPriceInWeth)
      : new BigNumber(0)

  const apy = price
    .times(COMB_PER_BLOCK)
    .times(BLOCKS_PER_YEAR)
    .times(stakedValue[currentFarmIndex]?.poolWeight)
    .div(stakedValue[currentFarmIndex]?.totalWethValue)
    .times(new BigNumber(100))

  const {
    baseTokenAmount = new BigNumber(0),
    quoteTokenAmount = new BigNumber(0),
    tokenAmountWholeLP = new BigNumber(0),
    quoteTokenAmountWholeLP = new BigNumber(0),
    poolWeight = new BigNumber(0)
  } = stakedValue?.[currentFarmIndex] || {}

  const liquidityWETH =
    sushiIndex >= 0 && stakedValue[sushiIndex] ? stakedValue[sushiIndex].quoteTokenAmountWholeLP : new BigNumber(0)

  const liquidityCOMB =
    sushiIndex >= 0 && stakedValue[sushiIndex] ? stakedValue[sushiIndex].baseTokenAmountWholeLP : new BigNumber(0)

  return {
    etherPrice,
    price,
    apy,
    baseTokenAmount,
    quoteTokenAmount,
    tokenAmountWholeLP,
    quoteTokenAmountWholeLP,
    liquidityWETH,
    liquidityCOMB,
    poolWeight
  } as any
}

export default usePrice

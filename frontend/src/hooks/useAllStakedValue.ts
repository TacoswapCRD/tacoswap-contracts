import { useCallback, useEffect, useState } from 'react'

import useBlock from './useBlock'
import { BigNumber } from 'bignumber.js'

type Pools = {
  pid: number
  baseTokenName: string
  baseTokenAmount: number
  baseTokenAmountWholeLP: number
  baseTokenSymbol: string
  lpTokenName: string
  lpTokenSymbol: string
  lpWethWorth: number
  poolWeight: number
  quoteTokenAmount: number
  quoteTokenAmountWholeLP: number
  quoteTokenName: string
  quoteTokenSymbol: string
  tokenPriceInWeth: number
  totalLPTokenStaked: number
  totalWethValue: number
}

const useAllStakedValue = (): any[] => {
  const [balances, setBalance] = useState<object[] | []>([])
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    try {
      const res = await fetch('https://api.tacoswap.io/pools')
      const pools = await res.json()
      if (pools) {
        return pools.map((pool: Pools) => {
          return {
            ...pool,
            baseTokenAmount: new BigNumber(pool.baseTokenAmount),
            quoteTokenAmount: new BigNumber(pool.quoteTokenAmount),
            baseTokenAmountWholeLP: new BigNumber(pool.baseTokenAmountWholeLP),
            quoteTokenAmountWholeLP: new BigNumber(pool.quoteTokenAmountWholeLP),
            totalLPTokenStaked: new BigNumber(pool.totalLPTokenStaked),
            lpWethWorth: new BigNumber(pool.lpWethWorth),
            totalWethValue: new BigNumber(pool.totalWethValue),
            tokenPriceInWeth: new BigNumber(pool.tokenPriceInWeth)
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }, [])
  useEffect(() => {
    fetchAllStakedValue().then(res => {
      setBalance(() => res)
    })
  }, [block, fetchAllStakedValue])
  return balances
}

export default useAllStakedValue

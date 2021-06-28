import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'

import { getStaked, getMasterChefContract } from '../etaco/utils'
import useeTaco from './useeTaco'
import { useWeb3React } from '@web3-react/core'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const sushi = useeTaco()
  const masterChefContract = getMasterChefContract(sushi)
  console.log("🚀 ~ file: useStakedBalance.ts ~ line 14 ~ useStakedBalance ~ masterChefContract", masterChefContract)

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterChefContract, pid, account)
    return balance
  }, [account, pid, masterChefContract])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
        .then(res => {
          setBalance(() => new BigNumber(res))
        })
        .catch(e => {
          console.log(e)
        })
    }
  }, [account, pid, fetchBalance, sushi])

  return balance
}

export default useStakedBalance

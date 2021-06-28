import { useCallback } from 'react'

import useeTaco from './useeTaco'

import { unstake, getMasterChefContract } from '../etaco/utils'
import { useWeb3React } from '@web3-react/core'

const useUnstake = (pid: number) => {
  const { account } = useWeb3React()
  const sushi = useeTaco()
  const masterChefContract = getMasterChefContract(sushi)

  const handleUnstake = useCallback(
    async amount => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      console.log(txHash)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, pid, sushi]
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake

import { useCallback } from 'react'
import useeTaco from './useeTaco'
import { stake, getMasterChefContract } from '../etaco/utils'
import { useWeb3React } from '@web3-react/core'

const useStake = (pid: any) => {
  const { account } = useWeb3React()
  const etaco = useeTaco()

  const handleStake = useCallback(
    async amount => {
      const txHash = await stake(getMasterChefContract(etaco), pid, amount, account)
      console.log(txHash)
    },
    [account, pid, etaco]
  )

  return { onStake: handleStake }
}

export default useStake

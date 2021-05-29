import { useCallback } from 'react'
import useUTaco from './useUTaco'
import { stake, getMasterChefContract } from '../utaco/utils'
import { useWeb3React } from '@web3-react/core'

const useStake = (pid: any) => {
  const { account } = useWeb3React()
  const utaco = useUTaco()

  const handleStake = useCallback(
    async amount => {
      const txHash = await stake(getMasterChefContract(utaco), pid, amount, account)
      console.log(txHash)
    },
    [account, pid, utaco]
  )

  return { onStake: handleStake }
}

export default useStake

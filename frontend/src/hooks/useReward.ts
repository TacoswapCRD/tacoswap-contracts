import { useCallback } from 'react'
import useUTaco from './useUTaco'
import { harvest, getMasterChefContract } from '../utaco/utils'
import { useWeb3React } from '@web3-react/core'

const useReward = (pid: number) => {
  const { account } = useWeb3React()
  const utaco = useUTaco()
  const masterChefContract = getMasterChefContract(utaco)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, pid, account)
    console.log('🚀 ~ file: useReward.ts ~ line 16 ~ handleReward ~ txHash', txHash)
    return txHash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pid, utaco])

  return { onReward: handleReward } as any
}

export default useReward

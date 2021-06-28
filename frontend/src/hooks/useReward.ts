import { useCallback } from 'react'
import useeTaco from './useeTaco'
import { harvest, getMasterChefContract } from '../etaco/utils'
import { useWeb3React } from '@web3-react/core'

const useReward = (pid: number) => {
  const { account } = useWeb3React()
  const etaco = useeTaco()
  const masterChefContract = getMasterChefContract(etaco)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, pid, account)
    console.log('🚀 ~ file: useReward.ts ~ line 16 ~ handleReward ~ txHash', txHash)
    return txHash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pid, etaco])

  return { onReward: handleReward } as any
}

export default useReward

import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { redeem } from '../etaco/utils'

const useRedeem = (masterChefContract: any) => {
  const { account } = useWeb3React()

  const handleRedeem = useCallback(async () => {
    const txHash = await redeem(masterChefContract, account)
    return txHash
  }, [account, masterChefContract])

  return { onRedeem: handleRedeem } as any
}

export default useRedeem

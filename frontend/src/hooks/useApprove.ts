import { useCallback } from 'react'
import useUTaco from './useUTaco'
import { useWeb3React } from '@web3-react/core'
import { approve, getMasterChefContract } from '../utaco/utils'

const useApprove = (lpContract: any) => {
  const { account } = useWeb3React()
  const sushi = useUTaco()
  const masterChefContract = getMasterChefContract(sushi)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

export default useApprove

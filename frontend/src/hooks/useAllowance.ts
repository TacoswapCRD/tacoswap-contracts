import { getAllowance } from '../utils/erc20'
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getMasterChefContract } from '../utaco/utils'
import { BigNumber } from 'bignumber.js'
import useUTaco from './useUTaco'
import { useWeb3React } from '@web3-react/core'

const useAllowance = (lpContract: Contract | null) => {
  const [allowance, setAllowance] = useState(() => new BigNumber(0))
  const { account } = useWeb3React()
  const sushi = useUTaco()
  const masterChefContract = getMasterChefContract(sushi)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(lpContract, masterChefContract, account)
    setAllowance(() => new BigNumber(allowance))
  }, [account, masterChefContract, lpContract])

  useEffect(() => {
    if (account && masterChefContract && lpContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, masterChefContract, lpContract])

  return allowance
}

export default useAllowance

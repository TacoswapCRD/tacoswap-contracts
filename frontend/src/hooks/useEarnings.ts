import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getEarned, getMasterChefContract } from '../utaco/utils'
import useUTaco from './useUTaco'
import useBlock from './useBlock'
import { useWeb3React } from '@web3-react/core'

const useEarnings = (pid: any) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const sushi = useUTaco()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, masterChefContract, pid])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, block, masterChefContract, setBalance, sushi])

  return balance
}

export default useEarnings

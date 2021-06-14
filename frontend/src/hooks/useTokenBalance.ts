import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getBalance } from '../utils/erc20'
import useBlock from './useBlock'
import { useWeb3React } from '@web3-react/core'

const useTokenBalance = (tokenAddress: any): BigNumber => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const block = useBlock()
  const { ethereum } = window

  const fetchBalance = useCallback(async () => {
    const balance = tokenAddress ? await getBalance(ethereum, tokenAddress, account) : 0
    return balance
  }, [account, ethereum, tokenAddress])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance().then(res => {
        setBalance(() => new BigNumber(res))
      })
    }
  }, [account, ethereum, block, fetchBalance, tokenAddress])

  return balance
}

export default useTokenBalance

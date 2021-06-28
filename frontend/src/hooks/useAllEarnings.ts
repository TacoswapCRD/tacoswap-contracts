import { useCallback, useEffect, useState } from 'react'
import { getEarned, getMasterChefContract, getFarms } from '../etaco/utils'
import useeTaco from './useeTaco'
import useBlock from './useBlock'
import { useWeb3React } from '@web3-react/core'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account } = useWeb3React()
  const sushi = useeTaco()
  const farms = getFarms(sushi)

  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: any = await Promise.all(
      farms.map(({ pid }: { pid: number }) => getEarned(masterChefContract, pid, account))
    )
    setBalance(() => balances)
  }, [account, masterChefContract, farms])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, block, masterChefContract, setBalance, sushi])
  return balances
}

export default useAllEarnings

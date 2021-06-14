import { useCallback, useEffect, useState } from 'react'
import { getContract } from '../utils/erc20'
import { Contract } from '@ethersproject/contracts'

export default function useLpContact(lpTokenAddress: string): Contract | null {
  const [lpContract, setLpContract] = useState(null)
  const { ethereum } = window
  const contract: any = useCallback(async () => {
    const res = await getContract(ethereum, lpTokenAddress)
    return res
  }, [ethereum, lpTokenAddress])
  useEffect(() => {
    contract().then((res: any) => {
      setLpContract(res)
    })
  }, [contract])

  return lpContract
}

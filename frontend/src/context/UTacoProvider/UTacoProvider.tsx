import React, { createContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import { eTaco } from '../../etaco/eTaco'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { ethers } from 'ethers'
export interface eTacoContext {
  etaco?: typeof eTaco
  block?: any
}

export const Context = createContext<eTacoContext>({
  etaco: undefined,
  block: undefined
})

interface SushiProvider {
  children: React.ReactNode
}
declare global {
  interface Window {
    etaco: any
    block: any
  }
}

const ethereum: any = window.ethereum

const SushiProvider = ({ children }: SushiProvider) => {
  const [block, setBlock] = useState(0)

  useEffect(() => {
    setTimeout(async () => {
      const provider = await ethers.getDefaultProvider()
      const blockNumber = await provider.getBlockNumber();
      setBlock(blockNumber);
    }, 3000);
    // eslint-disable-next-line
  }, [])

  return <Context.Provider value={{ block }}>{children}</Context.Provider>
}

export default SushiProvider

import React, { createContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import { UTaco } from '../../utaco/UTaco'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { ethers } from 'ethers'
export interface UTacoContext {
  utaco?: typeof UTaco
  block?: any
}

export const Context = createContext<UTacoContext>({
  utaco: undefined,
  block: undefined
})

interface SushiProvider {
  children: React.ReactNode
}
declare global {
  interface Window {
    utaco: any
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

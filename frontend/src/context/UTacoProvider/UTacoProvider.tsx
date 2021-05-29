import React, { createContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import { UTaco } from '../../utaco/UTaco'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
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
  const [utaco, setUtaco] = useState<any>()
  const { account } = useWeb3React()
  const [block, setBlock] = useState(0)
  const provider = new Web3.providers.WebsocketProvider('wss://eth.exio.tech/ws', {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000 // milliseconds
    },
    reconnect: {
      auto: true,
      delay: 2500,
      onTimeout: true
    }
  })

  // // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // // @ts-ignore
  // provider.on('close', err => {
  //   // invert your own error handling here
  // })

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const utacoLib = new UTaco(ethereum, chainId || 1, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 60000
      })
      setUtaco(() => utacoLib)
      window.utaco = utacoLib
    } else {
      const utacoLib = new UTaco(provider, 1, false, {
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 60000
      })
      console.log(utacoLib)
      setUtaco(() => utacoLib)
      window.utaco = utacoLib
    }
    // eslint-disable-next-line
  }, [ethereum, account])

  const subscribtion = useCallback(() => {
    const web3 = new Web3(provider)
    web3.eth.subscribe("newBlockHeaders", (e, { number })=> {
      console.log(web3);
      if (e) {
        console.error(e)
      }
      console.log("New block", number);
      setBlock(number)
    })
  }, [])

  // console.log(subscribtion());

  useEffect(() => {
    const web3 = new Web3(provider)

    const subscribtion = web3.eth.subscribe('newBlockHeaders', (e, { number }) => {
      if (e) {
        console.error(e)
      }

      console.log('New block', number)
      setBlock(number)
    })
    subscribtion.unsubscribe()
    // eslint-disable-next-line
  }, [])

  return <Context.Provider value={{ utaco, block }}>{children}</Context.Provider>
}

export default SushiProvider

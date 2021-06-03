import React, { useContext, useState } from 'react'

import useUTaco from '../../hooks/useUTaco'

import { getFarms } from '../../utaco/utils'
import { supportedPools } from '../../utaco/lib/constants'

import Context from './context'
import useAllStakedValue from '../../hooks/useAllStakedValue'
import { UTacoChefContext } from "../../hardhat/SymfoniContext"

interface TFarmsProvider {
  children: React.ReactNode
}

const FarmsProvider: React.FC<TFarmsProvider> = ({ children }: TFarmsProvider) => {
  console.log("🚀 ~ file: Farms.tsx ~ line 7 ~ supportedPools", supportedPools)
  const utacoChef = useContext(UTacoChefContext)
  const [unharvested] = useState(0)
  const utaco: any = utacoChef.instance
  // console.log("🚀 ~ file: Farms.tsx ~ line 17 ~ utaco", utaco )
  // const farms: any[] = getFarms(utaco)
  const farms: any[] = supportedPools
  console.log("🚀 ~ file: Farms.tsx ~ line 18 ~ farms", farms)
  const orders = farms.map(({ pid }): number[] => pid)
  const stakedValue = useAllStakedValue()?.sort((a, b): number => {
    return orders.indexOf(a.pid) - orders.indexOf(b.pid)
  })
  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
        stakedValue
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default FarmsProvider

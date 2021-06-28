import React, { useContext, useState } from 'react'

import useeTaco from '../../hooks/useeTaco'

import { getFarms } from '../../etaco/utils'
import { supportedPools } from '../../etaco/lib/constants'

import Context from './context'
import useAllStakedValue from '../../hooks/useAllStakedValue'
import { eTacoChefContext } from "../../hardhat/SymfoniContext"

interface TFarmsProvider {
  children: React.ReactNode
}

const FarmsProvider: React.FC<TFarmsProvider> = ({ children }: TFarmsProvider) => {
  console.log("🚀 ~ file: Farms.tsx ~ line 7 ~ supportedPools", supportedPools)
  const etacoChef = useContext(eTacoChefContext)
  const [unharvested] = useState(0)
  const etaco: any = etacoChef.instance
  // console.log("🚀 ~ file: Farms.tsx ~ line 17 ~ etaco", etaco )
  // const farms: any[] = getFarms(etaco)
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

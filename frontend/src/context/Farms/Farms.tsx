import React, { useState } from 'react'

import useUTaco from '../../hooks/useUTaco'

import { getFarms } from '../../utaco/utils'

import Context from './context'
import useAllStakedValue from '../../hooks/useAllStakedValue'

interface TFarmsProvider {
  children: React.ReactNode
}

const FarmsProvider: React.FC<TFarmsProvider> = ({ children }: TFarmsProvider) => {
  const [unharvested] = useState(0)
  const utaco: any = useUTaco()
  const farms: any[] = getFarms(utaco)
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

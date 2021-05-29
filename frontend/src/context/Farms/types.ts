import { Contract } from 'web3-eth-contract'
import React from 'react'

export interface Farm {
  pid: number
  name: string
  lpToken: string
  lpTokenAddress: string
  lpContract: Contract
  tokenAddress: string
  earnToken: string
  bonus: number
  active: boolean
  earnTokenAddress: string
  icon: React.ReactNode
  quoteIcon: React.ReactNode
  id: string
  tokenSymbol: string
  quoteTokenSymbol: string
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
  stakedValue: any[]
}

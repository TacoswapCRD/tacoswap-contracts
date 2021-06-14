import { createContext } from 'react'
import { FarmsContext } from './types'

const context = createContext<FarmsContext>({
  farms: [],
  unharvested: 0,
  stakedValue: []
})

export default context

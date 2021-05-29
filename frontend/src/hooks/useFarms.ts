import { useContext } from 'react'
import { Context as FarmsContext } from '../context/Farms'
const useFarms = () => {
  const { farms, unharvested, stakedValue } = useContext(FarmsContext)
  return { farms, unharvested, stakedValue }
}

export default useFarms

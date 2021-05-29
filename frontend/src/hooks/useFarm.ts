import { useContext } from 'react'
import { Context as FarmsContext } from '../context/Farms'

const useFarm = (id: number) => {
  const { farms } = useContext(FarmsContext)
  const farm = farms.find((farm: any) => farm.id === id)
  return farm
}

export default useFarm

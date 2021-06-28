import { useContext } from 'react'
import { Context } from '../context/eTacoProvider/eTacoProvider'

const useBlock = () => {
  const { block } = useContext(Context)
  return block
}

export default useBlock

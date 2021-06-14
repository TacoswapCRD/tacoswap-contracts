import { useContext } from 'react'
import { Context } from '../context/UTacoProvider/UTacoProvider'
import { UTacoTokenContext } from "../hardhat/SymfoniContext"

const useUTaco = () => {
  const utaco = useContext(UTacoTokenContext)
  // console.log("🚀 ~ file: useUTaco.ts ~ line 6 ~ useUTaco ~ Utoken",  Utoken.instance?.symbol())
  // const { utaco } = useContext(Context)
  return utaco.instance
}

export default useUTaco

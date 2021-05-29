import { useContext } from 'react'
import { Context } from '../context/UTacoProvider/UTacoProvider'
import { UTacoTokenContext } from "../hardhat/SymfoniContext"

const useUTaco = () => {
  const Utoken = useContext(UTacoTokenContext)
  console.log("🚀 ~ file: useUTaco.ts ~ line 6 ~ useUTaco ~ Utoken",  Utoken.instance?.symbol())
  const { utaco } = useContext(Context)
  return utaco
}

export default useUTaco

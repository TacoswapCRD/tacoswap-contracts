import { useContext } from 'react'
import { Context } from '../context/UTacoProvider/UTacoProvider'
import { UTacoTokenContext } from "../hardhat/SymfoniContext"

const useUTaco = () => {
  const Utoken = useContext(UTacoTokenContext)
  console.log("🚀 ~ file: useUTaco.ts ~ line 6 ~ useUTaco ~ Utoken", Utoken)
  const { utaco } = useContext(Context)
  console.log("🚀 ~ file: useUTaco.ts ~ line 8 ~ useUTaco ~ utaco", utaco)
  return utaco
}

export default useUTaco

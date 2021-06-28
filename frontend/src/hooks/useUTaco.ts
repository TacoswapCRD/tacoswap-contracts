import { useContext } from 'react'
import { Context } from '../context/eTacoProvider/eTacoProvider'
import { eTacoTokenContext } from "../hardhat/SymfoniContext"

const useeTaco = () => {
  const etaco = useContext(eTacoTokenContext)
  // console.log("🚀 ~ file: useeTaco.ts ~ line 6 ~ useeTaco ~ Utoken",  Utoken.instance?.symbol())
  // const { etaco } = useContext(Context)
  return etaco.instance
}

export default useeTaco

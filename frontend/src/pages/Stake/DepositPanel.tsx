import React, { useCallback, useState } from 'react'
import { StyledFlex } from '../../components/swap/styleds'
import { Input } from '../../components/NumericalInput'
import { Container, StyledButtonPrimary } from './styled'
import useeTacoBar from '../../hooks/useeTacoBar'
import useToken from '../../hooks/useToken'
import { formatFromBalance, formatToBalance } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { MaxButton } from '../Pool/styleds'

const DepositPanel = () => {
  const { allowance, approve, enter } = useeTacoBar()
  const { account } = useActiveWeb3React()
  const sushiBalanceBigInt = useToken('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')
  const sushiBalance = formatFromBalance(sushiBalanceBigInt?.value, sushiBalanceBigInt?.decimals)
  const decimals = sushiBalanceBigInt?.decimals
  const [requestedApproval, setRequestedApproval] = useState(false)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await approve()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve, setRequestedApproval])
  const [pendingTx, setPendingTx] = useState(false)
  // // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])
  // used for max input button
  const maxDepositAmountInput = sushiBalanceBigInt
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(sushiBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, sushiBalance])

  return (
    <>
      <Container>
        <StyledFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: '0' }}>
          <Input placeholder="0.00" value={depositValue} onUserInput={val => onUserDepositInput(val)} />
          {account && <MaxButton onClick={() => handleMaxDeposit()}>Max</MaxButton>}
          {!allowance || Number(allowance) === 0 ? (
            <StyledButtonPrimary onClick={() => handleApprove()} disabled={requestedApproval}>
              Approve
            </StyledButtonPrimary>
          ) : (
            <StyledButtonPrimary
              onClick={async () => {
                setPendingTx(true)
                if (maxSelected) {
                  await enter(maxDepositAmountInput)
                } else {
                  await enter(formatToBalance(depositValue, decimals))
                }
                setPendingTx(false)
              }}
              disabled={
                pendingTx || !sushiBalance || Number(depositValue) === 0 || Number(depositValue) > Number(sushiBalance)
              }
            >
              Deposit
            </StyledButtonPrimary>
          )}
        </StyledFlex>
      </Container>
    </>
  )
}

export default DepositPanel

import React, { useCallback, useState } from 'react'
import { StyledFlex } from '../../components/swap/styleds'
import { Input } from '../../components/NumericalInput'
import { Container, StyledButtonPrimary } from './styled'
import useUTacoBar from '../../hooks/useUTacoBar'
import useToken from '../../hooks/useToken'
import { formatFromBalance, formatToBalance } from '../../utils'
import { MaxButton } from '../Pool/styleds'
import { useActiveWeb3React } from '../../hooks'

const WithdrawPanel = () => {
  const { allowance, approve, leave } = useUTacoBar()
  const { account } = useActiveWeb3React()
  const xSushiBalanceBigInt = useToken('0x8798249c2e607446efb7ad49ec89dd1865ff4272')
  const xSushiBalance = formatFromBalance(xSushiBalanceBigInt?.value, xSushiBalanceBigInt?.decimals)
  const decimals = xSushiBalanceBigInt?.decimals

  // handle approval
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

  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])
  const maxDepositAmountInput = xSushiBalanceBigInt

  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(xSushiBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, xSushiBalance])
  return (
    <>
      <Container marginBottom="0px">
        <StyledFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: '0' }}>
          <Input value={depositValue} placeholder="0.00" onUserInput={val => onUserDepositInput(val)} />
          {account && <MaxButton onClick={handleMaxDeposit}>Max</MaxButton>}
          {!allowance || Number(allowance) === 0 ? (
            <StyledButtonPrimary onClick={() => handleApprove()} disabled={requestedApproval}>
              Approve
            </StyledButtonPrimary>
          ) : (
            <StyledButtonPrimary
              disabled={
                pendingTx ||
                !xSushiBalance ||
                Number(depositValue) === 0 ||
                Number(depositValue) > Number(xSushiBalance)
              }
              onClick={async () => {
                setPendingTx(true)
                if (maxSelected) {
                  await leave(maxDepositAmountInput)
                } else {
                  await leave(formatToBalance(depositValue, decimals))
                }
                setPendingTx(false)
              }}
            >
              Deposit
            </StyledButtonPrimary>
          )}
        </StyledFlex>
      </Container>
    </>
  )
}

export default WithdrawPanel

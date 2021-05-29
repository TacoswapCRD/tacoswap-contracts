import Button from '../../../components/Button/Button'
// import TokenInput from 'components/TokenInputs'
import styled from 'styled-components'
import React, { useCallback, useMemo, useState } from 'react'
import ModalActions from '../../../components/ModalActions'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import ModalTitle from './ModalTitle'
import { BigNumber } from 'bignumber.js'

interface WithdrawalModal {
  onConfirm: (val: string) => Promise<any>
  onDismiss: () => void
  max: BigNumber
  tokenName: string
}

const WithdrawModal = ({ onConfirm, onDismiss, max, tokenName = '' }: WithdrawalModal) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    e => {
      setVal(e.currentTarget.value)
    },
    [setVal]
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleConfirm = () => {
    setPendingTx(true)
    onConfirm(val)
      .then(res => {
        console.log(res)
        setPendingTx(false)
        onDismiss()
      })
      .catch(e => {
        setPendingTx(false)
        console.error(e)
      })
  }

  return (
    <>
      <StyledFlexContainer>
        <ModalTitle onDismiss={onDismiss} text={`Withdraw ${tokenName}`} />
        {/* <TokenInput
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          value={val}
          max={fullBalance}
          symbol={tokenName}
        /> */}
        <ModalActions>
          <Button text="Cancel" onClick={onDismiss} />
          <Button disabled={pendingTx} text={pendingTx ? 'Pending Confirmation' : 'Confirm'} onClick={handleConfirm} />
        </ModalActions>
      </StyledFlexContainer>
    </>
  )
}

export default WithdrawModal

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  width: 100%;
`

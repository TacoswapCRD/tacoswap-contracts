import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button/Button'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import ModalTitle from './ModalTitle'
// import TokenInput from 'components/TokenInputs'
import ModalActions from '../../../components/ModalActions'
import styled from 'styled-components'
import { BigNumber } from 'bignumber.js'

interface DepositModal {
  onConfirm: (val: string) => Promise<any>
  onDismiss: () => void
  max: BigNumber
  tokenName: string
}

const DepositModal = ({ max, onConfirm, onDismiss, tokenName = '' }: DepositModal) => {
  const [val, setVal] = useState('0')
  const [pendingTx, setPendingTx] = useState(false)
  console.log(onDismiss)
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

  return (
    <>
      <StyledFlexContainer>
        <ModalTitle height={72} onDismiss={onDismiss} text={`Deposit ${tokenName} Tokens`} />
        {/* <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
        /> */}
        <ModalActions padding="24px 0">
          <Button size="md" width="100%" text="Cancel" onClick={onDismiss} />
          <Button
            size="md"
            width="100%"
            disabled={pendingTx}
            text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
            onClick={async () => {
              try {
                setPendingTx(true)
                await onConfirm(val)
                setPendingTx(false)
                onDismiss()
              } catch (e) {
                setPendingTx(false)
                console.error(e)
              }
            }}
          />
        </ModalActions>
      </StyledFlexContainer>
    </>
  )
}

export default DepositModal

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  width: 100%;
`

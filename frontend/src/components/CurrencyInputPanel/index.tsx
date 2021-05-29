import { Currency, Pair } from '@uniswap/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  background: transparent;
  border: ${({ theme, selected }) => (!selected ? `1px solid ${theme.brown1}` : 'none')};
  border-radius: 21px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '')};
  color: ${({ selected, theme }) => (selected ? theme.white : theme.white)};
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  user-select: none;
  outline: none;
  padding: ${({ selected }) => (selected ? '15px 23px' : '17.5px 23px')};
  @media (max-width: 420px) {
    font-size: 16px;
    padding: ${({ selected }) => (selected ? '3px 0' : '4px 0')};
    width: ${({ selected }) => !selected && '115px'};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.white};
  font-size: 0.75rem;
  line-height: 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ theme }) => theme.brown1};
    stroke-width: 1.5px;
  }
  @media (max-width: 420px) {
    width: 6px;
    height: 4px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
  z-index: 1;
`

export const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '8px')};
  background: #fff5ea;
  padding: 11px 22px 11px;
  @media (max-width: 420px) {
    padding: 6px 10px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '22px' : '16px')};
  color: ${({ theme }) => theme.brown1};
  display: flex;
  align-items: auto;
  justify-content: center !important;
  @media (max-width: 420px) {
    ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin:auto')}
  }
`
const StyledSpanMobile = styled.span<{ fontSize?: string }>`
  @media (max-width: 420px) {
    font-size: ${({ fontSize }) => fontSize && fontSize};
  }
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  stake?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  stake = false
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  if (stake) {
    return (
      <Container hideInput={hideInput}>
        <InputRow selected={disableCurrencySelect}>
          {!hideInput && (
            <NumericalInput
              value={value}
              onUserInput={val => {
                onUserInput(val)
              }}
            />
          )}
        </InputRow>
      </Container>
    )
  }

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.brown1} fontWeight={500} fontSize={14} opacity={0.5}>
                <StyledSpanMobile fontSize="12px">{label}</StyledSpanMobile>
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.brown1}
                  fontWeight={400}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  <StyledSpanMobile fontSize="12px">
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                      : ' -'}
                  </StyledSpanMobile>
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  <StyledSpanMobile fontSize="12px">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledSpanMobile>
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  <StyledSpanMobile fontSize="12px">
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || t('selectToken')}
                  </StyledSpanMobile>
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}

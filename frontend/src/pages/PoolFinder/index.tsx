import { Currency, ETHER, JSBI, TokenAmount } from '@uniswap/sdk'
import { StyledFlex, Wrapper } from '../../components/swap/styleds'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../components/Button'
import { OutlinedCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { Dots } from '../Pool/styleds'
import AppBody from '../AppBody'
import useTheme from '../../hooks/useTheme'
import { TYPE } from '../../theme'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder() {
  const { account } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <OutlinedCard padding="20px">
      <TYPE.brown textAlign="center">
        {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
      </TYPE.brown>
    </OutlinedCard>
  )

  const theme = useTheme()

  return (
    <StyledFlex maxWidth="100%">
      <AppBody marginTop="88px" padding="0 19px 30px">
        <Wrapper padding="52px 20px 0" noShadow>
          <AddRemoveTabs importpool />
          <AutoColumn
            radius="16px"
            style={{ background: ' #ffffff', boxShadow: '0 0 40px rgb(255 150 45 / 6%)', padding: '54px 20px 58px' }}
            gap="md"
          >
            <ButtonDropdownLight
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN0)
              }}
            >
              {currency0 ? (
                <Row>
                  <CurrencyLogo currency={currency0} />
                  <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                    {currency0.symbol}
                  </Text>
                </Row>
              ) : (
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                  Select a Token
                </Text>
              )}
            </ButtonDropdownLight>

            <ColumnCenter>
              <Plus size="16" color={theme.brown1} />
            </ColumnCenter>

            <ButtonDropdownLight
              marginBottom="20px"
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN1)
              }}
            >
              {currency1 ? (
                <Row>
                  <CurrencyLogo currency={currency1} />
                  <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                    {currency1.symbol}
                  </Text>
                </Row>
              ) : (
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                  Select a Token
                </Text>
              )}
            </ButtonDropdownLight>

            {hasPosition && (
              <ColumnCenter
                style={{
                  justifyItems: 'center',
                  backgroundImage: `${theme.linear1}`,
                  padding: '12px 0px',
                  borderRadius: '12px'
                }}
              >
                <Text textAlign="center" fontWeight={500}>
                  Pool Found!
                </Text>
                <StyledInternalLink to={`/pool`} color="white">
                  <Text textAlign="center">Manage this pool.</Text>
                </StyledInternalLink>
              </ColumnCenter>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard pair={pair} border={`1px solid ${theme.border2}`} />
                ) : (
                  <OutlinedCard padding="20px">
                    <AutoColumn gap="sm" justify="center">
                      <TYPE.brown textAlign="center">You don’t have liquidity in this pool yet.</TYPE.brown>
                      <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                        <Text textAlign="center">Add liquidity.</Text>
                      </StyledInternalLink>
                    </AutoColumn>
                  </OutlinedCard>
                )
              ) : validPairNoLiquidity ? (
                <OutlinedCard padding="20px">
                  <AutoColumn gap="sm" justify="center">
                    <TYPE.brown textAlign="center">No pool found.</TYPE.brown>
                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      Create pool.
                    </StyledInternalLink>
                  </AutoColumn>
                </OutlinedCard>
              ) : pairState === PairState.INVALID ? (
                <OutlinedCard padding="20px">
                  <AutoColumn gap="sm" justify="center">
                    <TYPE.brown textAlign="center" fontWeight={500}>
                      Invalid pair.
                    </TYPE.brown>
                  </AutoColumn>
                </OutlinedCard>
              ) : pairState === PairState.LOADING ? (
                <OutlinedCard padding="20px">
                  <AutoColumn gap="sm" justify="center">
                    <TYPE.brown textAlign="center">
                      Loading
                      <Dots />
                    </TYPE.brown>
                  </AutoColumn>
                </OutlinedCard>
              ) : null
            ) : (
              prerequisiteMessage
            )}
          </AutoColumn>

          <CurrencySearchModal
            isOpen={showSearch}
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
            showCommonBases
            selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
          />
        </Wrapper>
      </AppBody>
    </StyledFlex>
  )
}

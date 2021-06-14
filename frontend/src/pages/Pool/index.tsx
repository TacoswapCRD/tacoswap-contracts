import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair, JSBI } from '@uniswap/sdk'

import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { BorderedButton } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import Button from '../../components/Button/Button'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 94px 0 0;
  /* min-height: calc(100% - 78px); */
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const StyledLiquidityProvider = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg8};
  border-radius: 8px;
  padding: 20px 27px 40px;
  width: 100%;
`

const ButtonRow = styled(RowFixed)`
  justify-content: flex-end;
  margin-right: 15px;
  gap: 8px;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
`

const EmptyProposals = styled.div`
  border: 1px solid rgba(97, 78, 86, 0.2);
  padding: 16px 12px;
  background: #fbfdff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pool() {
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <InnerContainer>
          <StyledLiquidityProvider>
            <TYPE.main fontWeight="bold" fontSize={16} margin="0 0 12px">
              Liquidity Provider
            </TYPE.main>
            <TYPE.brownOpacity fontSize={14}>
              Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added
              to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
            </TYPE.brownOpacity>
          </StyledLiquidityProvider>
          <FlexContainer>
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <HideSmall>
                  <TYPE.main fontWeight="bold" fontSize={22} style={{ justifySelf: 'flex-start' }}>
                    Your liquidity
                  </TYPE.main>
                </HideSmall>
                <ButtonRow width="50%">
                  <Button to="/create/ETH" width="158px" primary={true} size="add" text="Create a pair" />
                  <Button
                    specialHover
                    background="linear-gradient(270deg, #EC6A46 0%, #F4B740 100%)"
                    size="add"
                    to="/add/ETH"
                    text="Add Liquidity"
                    width="158px"
                  />
                </ButtonRow>
              </TitleRow>

              {!account ? (
                <Card bg="#FBFDFF" borderRadius="8px" border="1px solid rgba(97, 78, 86, 0.2)" padding="40px">
                  <TYPE.brownOpacity fontSize={18} textAlign="center">
                    Connect to a wallet to view your liquidity.
                  </TYPE.brownOpacity>
                </Card>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <TYPE.brownOpacity textAlign="center">
                    <Dots>Loading</Dots>
                  </TYPE.brownOpacity>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  <ExternalLink color="#EE9F47" href={'https://uniswap.info/account/' + account}>
                    <BorderedButton>
                      <RowBetween>
                        <span>Account analytics and accrued fees</span>
                        <span> ↗</span>
                      </RowBetween>
                    </BorderedButton>
                  </ExternalLink>
                  {v2PairsWithoutStakedAmount.map(v2Pair => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                </>
              ) : (
                <EmptyProposals>
                  <TYPE.brownOpacity textAlign="center">No liquidity found.</TYPE.brownOpacity>
                </EmptyProposals>
              )}

              <AutoColumn justify={'center'} gap="md">
                <TYPE.main textAlign="center" fontSize={16} style={{ padding: '.5rem 0 .5rem 0' }}>
                  {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
                  <StyledInternalLink
                    color="#FA9E3A"
                    id="import-pool-link"
                    to={hasV1Liquidity ? '/migrate/v1' : '/find'}
                  >
                    {hasV1Liquidity ? 'Migrate now.' : 'Import it.'}
                  </StyledInternalLink>
                </TYPE.main>
              </AutoColumn>
            </AutoColumn>
          </FlexContainer>
        </InnerContainer>
      </PageWrapper>
    </>
  )
}

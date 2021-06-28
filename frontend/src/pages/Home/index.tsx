import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Label from '../../components/Label/Label'
import Spacer from '../../components/Spacer'
import Button from '../../components/Button/Button'
import BigNumber from 'bignumber.js'
import Value from '../../components/Value'
import useTokenBalance from '../../hooks/useTokenBalance'
import useeTaco from '../../hooks/useeTaco'
import { getSushiAddress, getSushiSupply } from '../../etaco/utils'
import { getBalanceNumber } from '../../utils/formatBalance'
import FarmCards from '../Farms/FarmCards'
import usePrice from '../../hooks/usePrice'
import { PendingRewards } from './pendingRewards'
import useFarms from '../../hooks/useFarms'
import { useWeb3React } from '@web3-react/core'
import PageHeader from '../../components/PageHader'
import useTheme from '../../hooks/useTheme'
import { StyledFlex } from '../../components/swap/styleds'
import { eTacoTokenContext, SignerContext, CurrentAddressContext  } from '../../hardhat/SymfoniContext'

const Balances = () => {
  const theme = useTheme()
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0))
  const [etacoBalance, seteTacoBalance] = useState(new BigNumber(0))
  const [totalLocked, setTotalLocked] = useState(new BigNumber(0))
  const { stakedValue } = useFarms()
  const etaco = useeTaco()
  const { account } = useWeb3React()
  const sushiBalance = useTokenBalance(getSushiAddress(etaco))
  const { etherPrice, price, liquidityWETH, liquidityCOMB }: any = usePrice({
    0: 'TACO-ETH UNI V2 LP',
    1: 'USDT-ETH SLP'
  })
  const [signer, setSigner] = useContext(SignerContext)
  const [currentAddress, setCurrentAddress] = useContext(CurrentAddressContext)
  const eTacoToken = useContext(eTacoTokenContext)
  useEffect(() => {
    if (stakedValue.length) {
      const totalLocked = stakedValue.reduce((t: any, n: any) => t.plus(n.totalWethValue), new BigNumber(0))
      setTotalLocked(totalLocked)
    }
  }, [stakedValue])

  useEffect(() => {
    async function fetchTotalSupply() {
      const burned = new BigNumber(250)
      if (!eTacoToken.instance) {
        return new BigNumber(0);
      }
      const supply = new BigNumber((await eTacoToken.instance.totalSupply()).toString()).minus(
        burned.multipliedBy(new BigNumber(10).pow(18))
      )
      console.log('🚀 ~ file: index.tsx ~ line 44 ~ fetchTotalSupply ~ supply', supply)
      return supply
    }

    fetchTotalSupply().then(res => {
      setTotalSupply(() => res)
      console.log("🚀 ~ file: index.tsx ~ line 52 ~ fetchTotalSupply ~ res", res)
    })
  }, [])

  useEffect(() => {
    async function fetcheTacoBalance() {
      const burned = new BigNumber(250)
      if (!eTacoToken.instance) {
        return new BigNumber(0);
      }
      const etacoBalance = new BigNumber((await eTacoToken.instance.balanceOf(currentAddress)).toString())
      console.log('🚀 ~ file: index.tsx ~ line 44 ~ fetchTotalSupply ~ supply', etacoBalance)
      return etacoBalance
    }

    fetcheTacoBalance().then(res => {
      seteTacoBalance(() => res)
      console.log("🚀 ~ file: index.tsx ~ line 52 ~ fetchTotalSupply ~ res", res)
    })
  }, [])

  const tacoBalance = (balance: number) => {
    if (balance < 1000000) {
      return balance
    }
    if (balance < 1000000000) {
      return parseInt((balance / 1000000).toFixed()) + 'M'
    }
    return parseInt((balance / 1000000000).toFixed()) + 'B'
  }

  return (
    <>
      <StyledDiv>
        <MobilePageHeader>
          <PageHeader
            title="Claim your very own TACOs"
            subtitle="Stake UNI V2 LP and TACO LP tokens"
            padding="58px 0 48px"
            subtitleMargin="19px 0 0 0"
          />
        </MobilePageHeader>
        <StyledDivs>
          <StyledWrapper>
            <StyledCardWrapper>
              <StyledCardContent>
                <StyledBalances>
                  <StyledBalance>
                    <StyledBalanceContent>
                      <div style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Label text="Your eTaco Balance" />
                        <StyledFlex justifyContent="space-between" mb="0">
                          <Value size="lg" value={!!currentAddress ? tacoBalance(getBalanceNumber(etacoBalance)) : 'Locked'} />
                          <StyledConvertions>
                            <StyledParagraph mt="-10px">
                              <Value
                                value={price.toNumber() ? getBalanceNumber(sushiBalance.times(price)) : 'Locked'}
                                symbol="Ξ"
                                size="sm"
                                decimals={2}
                              />
                            </StyledParagraph>
                            <StyledParagraph>
                              <Value
                                value={
                                  price.toNumber()
                                    ? getBalanceNumber(price.times(etherPrice).times(sushiBalance))
                                    : 'Locked'
                                }
                                symbol="$"
                                size="sm"
                                decimals={0}
                              />
                            </StyledParagraph>
                          </StyledConvertions>
                        </StyledFlex>
                      </div>
                    </StyledBalanceContent>
                  </StyledBalance>
                </StyledBalances>
                {!!account && (
                  <Footnote>
                    Unclaimed:&nbsp; &nbsp;
                    <PendingRewards />
                  </Footnote>
                )}
              </StyledCardContent>
              <StyledFooter>
                <div style={{ width: '96px' }}>
                  <Button
                    text="Enter"
                    size="sm"
                    to="/farms"
                    background={theme.linear3}
                    variant="secondary"
                    paddingLeft={'0'}
                    paddingRight={'0'}
                  />
                </div>
              </StyledFooter>
            </StyledCardWrapper>
            <Spacer size="sm" />
            <StyledCardWrapper>
              <StyledCardContent>
                <StyledBalances>
                  <StyledBalance>
                    <StyledBalanceContent>
                      <div style={{ width: '100%', justifyContent: 'flex-start' }}>
                        <Label text="eTaco Price" />
                        <Value
                          size="lg"
                          value={price.toNumber() ? price.toNumber() : 'Locked'}
                          symbol="Ξ"
                          decimals={2}
                        />
                      </div>
                      <StyledConvertions>
                        <StyledParagraph>
                          <Value
                            value={price.toNumber() ? price.times(etherPrice).toNumber() : 'Locked'}
                            symbol="$"
                            size="sm"
                            decimals={2}
                          />
                        </StyledParagraph>
                      </StyledConvertions>
                    </StyledBalanceContent>
                  </StyledBalance>
                </StyledBalances>
                {!!account && (
                  <PriceFootnote>
                    LP: &nbsp;
                    <Value
                      value={liquidityWETH.toNumber() ? liquidityWETH.toNumber() : 'Locked'}
                      symbol="Ξ"
                      decimals={2}
                      size="sm"
                    />
                    &nbsp;/&nbsp;
                    <Value
                      value={liquidityCOMB.toNumber() ? tacoBalance(liquidityCOMB.toNumber()) : 'Locked'}
                      symbol="TACO"
                      decimals={2}
                      size="sm"
                    />
                  </PriceFootnote>
                )}
              </StyledCardContent>
              <StyledFooter>
                <StyledButtonDiv>
                  <div style={{ width: '96px', marginRight: '17px' }}>
                    <Button
                      paddingLeft={'0'}
                      paddingRight={'0'}
                      text="Trade"
                      size="sm"
                      href="https://combine.exchange/swap?outputCurrency=0x7d36cce46dd2b0d28dde12a859c2ace4a21e3678"
                      background={theme.linear3}
                      variant="secondary"
                    />
                  </div>
                  <div style={{ width: '96px' }}>
                    <Button
                      paddingLeft={'0'}
                      paddingRight={'0'}
                      secondary={true}
                      text="Pool"
                      size="sm"
                      href="https://info.combine.exchange/pair/0x6e168d4fD7569EA1C56d985256cd2E93ee12490e"
                    />
                  </div>
                </StyledButtonDiv>
              </StyledFooter>
            </StyledCardWrapper>
          </StyledWrapper>

          <Spacer />

          <StyledRight>
            <StyledCardContentInherit>
              <StyledBalanceContent>
                <div>
                  <Label text="Total Circulating Supply" />
                  <Value size="lg" symbol="eTaco" value={tacoBalance(getBalanceNumber(totalSupply))} decimals={3} />
                </div>
                <StyledConvertions>
                  <StyledParagraph>
                    <Value
                      value={price.toNumber() ? tacoBalance(getBalanceNumber(totalSupply.times(price))) : 'Locked'}
                      symbol="Ξ"
                      size="sm"
                      decimals={2}
                    />
                  </StyledParagraph>
                  <StyledParagraph>
                    <Value
                      value={
                        price.toNumber()
                          ? tacoBalance(getBalanceNumber(totalSupply.times(price).times(etherPrice)))
                          : 'Locked'
                      }
                      symbol="$"
                      size="sm"
                      decimals={2}
                    />
                  </StyledParagraph>
                </StyledConvertions>
              </StyledBalanceContent>

              <FootnoteRight>Current emission rate 10 eTaco per block</FootnoteRight>
            </StyledCardContentInherit>
            <Spacer />
            <StyledCardContentInherit>
              <StyledBalanceContent>
                <div style={{ width: '100%', paddingLeft: '10px' }}>
                  <Label text="Total Locked Value" />
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
                  >
                    <Value
                      size="lg"
                      value={totalLocked ? getBalanceNumber(totalLocked, 0) : 'Locked'}
                      decimals={2}
                      symbol="Ξ"
                    />
                    <StyledConvertions>
                      <Value
                        value={
                          totalLocked
                            ? tacoBalance(getBalanceNumber(totalLocked.multipliedBy(etherPrice), 0))
                            : 'Locked'
                        }
                        decimals={2}
                        size="sm"
                        symbol="≈ $"
                      />
                    </StyledConvertions>
                  </div>
                </div>
              </StyledBalanceContent>
            </StyledCardContentInherit>
          </StyledRight>
        </StyledDivs>
        <FarmCards
          homeFarmCards={true}
          width="inherit"
          display="flex"
          padding="0 0 45px 0"
          marginTop="166px"
          marginBottom="80px"
          mobilePadding="0 49px 45px 49px"
        />
      </StyledDiv>
    </>
  )
}

export default Balances

const MobilePageHeader = styled.div`
  @media (max-width: 1113px) {
    width: 90%;
    margin: auto;
  }
`

const StyledDiv = styled.div`
  box-sizing: border-box;
  padding: 0px 24px;
  width: 100%;
  @media (max-width: 731px) {
    padding: 0 8px;
  }
`

const StyledConvertions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 8px 20px 8px 8px;
`

const StyledButtonDiv = styled.div`
  display: flex;
`

const StyledParagraph = styled.div<{ mt?: string }>`
  position: relative;
  margin-top: ${({ mt }) => mt && mt};
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:before {
    content: '≈';
    position: absolute;
    left: -16px;
    top: -2px;
  }
`

const Footnote = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: row;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  margin-top: 19px;
`

const PriceFootnote = styled(Footnote)`
  margin-top: 25px;
`

const StyledFooter = styled.div`
  box-sizing: border-box;
  border-top: 2px solid ${({ theme }) => theme.border};
  width: 100%;
  padding: 17px 0 17px 18px;
`

const FootnoteRight = styled.div`
  font-size: 12px;
  margin-top: 11px;
  color: ${({ theme }) => theme.brown1};
  opacity: 0.6;
`

const StyledWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  height: inherit;
  width: 55%;
  color: #fff;
  @media (max-width: 992px) {
    flex-flow: row nowrap;
    align-items: stretch;
    margin-right: 10px;
    width: 100%;
  }
  @media (max-width: 692px) {
    flex-direction: column;
    width: 96%;
    margin: auto;
  }
`

const StyledBalances = styled.div`
  display: flex;
  width: 100%;
`

const StyledBalance = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
`

const StyledBalanceContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const StyledRight = styled.div`
  color: ${({ theme }) => theme.brown1};
  display: flex;
  flex-direction: column;
  justify-content: right;
  height: inherit;
  width: 45%;
  @media (max-width: 992px) {
    width: 100%;
  }
  @media (max-width: 692px) {
    width: 96%;
    margin: auto;
  }
`

const StyledCardContent = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 49px 3px 15px 32px;
  border-radius: 11px;
`

const StyledCardContentInherit = styled(StyledCardContent)`
  background: ${({ theme }) => theme.bg6};
  border: 1px solid ${({ theme }) => theme.border};
  padding-top: 12px;
`

const StyledDivs = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 992px) {
    width: 90%;
    margin: auto;
    height: auto;
    flex-direction: column;
  }
  @media (max-width: 692px) {
    width: 100%;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: flex-start;
  width: 50%;
  box-shadow: 0px 4px 16px rgba(254, 187, 120, 0.6);
  border-radius: 11px;
  background: ${({ theme }) => theme.linear1};
  @media (min-width: 993px) {
    height: 100%;
  }
  @media (max-width: 692px) {
    width: 100%;
  }
`

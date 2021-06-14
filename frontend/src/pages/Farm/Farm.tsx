import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ReactComponent as CloseIcon } from '../../assets/svg/CloseIcon.svg'
import { ReactComponent as ButtonIcon } from '../../assets/svg/Group.svg'
import { ReactComponent as PlusIcon } from '../../assets/svg/Subtract.svg'
import { ReactComponent as ButtonIconUnion } from '../../assets/svg/Union.svg'
import Value from '../../components/Value/Value'
import useAllStakedValue from '../../hooks/useAllStakedValue'
import useFarm from '../../hooks/useFarm'
import useFarms from '../../hooks/useFarms'
import { BigNumber } from '../../utaco'
import MyStakeCard from './components/MyStakedCard'
import TotalStakedCard from './components/TotalStakedCard'
import { StyledButtonDiv, StyledP2 } from './components/styled'
import Button from '../../components/Button/Button'
import { StyledCardFarm } from '../../pages/Farms/FarmCards'
import { StyledIcon } from './components/styled'
// import { PageHeaderProto } from '../../components/PageHader/PageHeader'
import useTheme from '../../hooks/useTheme'

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  width: 15px;
  height: 15px;
  path {
    fill: ${({ theme }) => theme.brown1};
  }
`

const Farm = () => {
  const { farmId }: any = useParams()
  const {
    lpToken,
    lpTokenAddress,
    tokenAddress,
    tokenSymbol,
    quoteTokenSymbol,
    earnToken,
    name,
    icon,
    quoteIcon,
    bonus
  } = useFarm(farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    tokenSymbol: '',
    quoteTokenSymbol: '',
    earnToken: '',
    name: '',
    icon: null,
    quoteIcon: null,
    bonus: 0
  }

  const { farms } = useFarms()
  const currentFarmIndex = farms.findIndex((farm: any) => farm.id === farmId)

  const BLOCKS_PER_YEAR = new BigNumber(2336000)
  const COMB_PER_BLOCK = new BigNumber(39 / 6500)

  const stakedValue = useAllStakedValue()

  const sushiIndex = farms.findIndex(({ lpToken }: any) => lpToken === 'TACO-ETH UNI V2 LP')

  const usdtIndex = farms.findIndex(({ lpToken }: any) => lpToken === 'USDT-ETH SLP')

  const price = sushiIndex >= 0 && stakedValue[sushiIndex] ? stakedValue[sushiIndex].tokenPriceInWeth : new BigNumber(0)

  const etherPrice =
    usdtIndex >= 0 && stakedValue[usdtIndex]
      ? new BigNumber(1).div(stakedValue[usdtIndex].tokenPriceInWeth)
      : new BigNumber(0)

  const apy = price
    .times(COMB_PER_BLOCK)
    .times(BLOCKS_PER_YEAR)
    .times(stakedValue[currentFarmIndex]?.poolWeight)
    .div(stakedValue[currentFarmIndex]?.totalWethValue)
    .times(new BigNumber(100))

  const {
    baseTokenAmount = new BigNumber(0),
    quoteTokenAmount = new BigNumber(0),
    tokenAmountWholeLP = new BigNumber(0),
    quoteTokenAmountWholeLP = new BigNumber(0)
  } = stakedValue?.[currentFarmIndex] || {}

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dailyCOMB = (bonus * 39) / 100
  const theme = useTheme()

  return (
    <StyledCardFarm
      width="auto"
      mobilePadding="65px 53px 45px"
      display="block"
      marginBottom="36px"
      marginTop="81px"
      marginLeft="42px"
      marginRight="42px"
      mobileWidth="100%"
    >
      <StyledCloseButton>
        <Button
          size="sm"
          background="transparent"
          hoverBackground="transparent"
          to="/farms"
          text={<StyledCloseIcon />}
        />
      </StyledCloseButton>
      <StyledHeader>
        <div>
          {/* <PageHeaderProto
            size="45px"
            padding="0"
            flexDirection="row"
            icon={icon}
            subtitle={`Deposit ${lpToken}  Tokens and earn ${earnToken}`}
            title={name}
          /> */}
        </div>
        <StyledButtonDiv>
          <Button
            size="icon-button"
            padding={40}
            background="transparent"
            butColor={true}
            borderRadius="50%"
            fontSize={14}
            margin="0 20px 0 0"
            href={`https://info.combine.exchange/pair/${lpTokenAddress}`}
            text={<ButtonIcon />}
          />
          <Button
            size="icon-button"
            margin="0 20px 0 0"
            href={`https://combine.exchange/swap?outputCurrency=${tokenAddress}`}
            borderRadius="50%"
            hoverBackground={theme.linear1}
            text={<ButtonIconUnion />}
          />
          <Button
            size="icon-button"
            butColor={true}
            background="transparent"
            borderRadius="50%"
            fontSize={25}
            padding={20}
            href={`https://combine.exchange/add/ETH/${tokenAddress}`}
            text={<PlusIcon />}
          />
        </StyledButtonDiv>
      </StyledHeader>
      <StyledCalcDiv>
        <StyledCalcMobile>
          <StyledCalc>
            <StyledIcon>{icon}</StyledIcon>
            <StyledP>
              &nbsp;
              <Value size="sm" value={1} symbol={tokenSymbol} />
              &nbsp;=&nbsp;
              {baseTokenAmount.div(quoteTokenAmount).toNumber() && (
                <Value
                  size="sm"
                  value={quoteTokenAmount.div(baseTokenAmount).toNumber()}
                  symbol={quoteTokenSymbol}
                  decimals={4}
                />
              )}
            </StyledP>
          </StyledCalc>
          <StyledCalc>
            <StyledIcon>{quoteIcon}</StyledIcon>
            <StyledP>
              <Value value={1} size="sm" />
              &nbsp;=&nbsp;
              {baseTokenAmount.div(quoteTokenAmount).toNumber() && (
                <Value value={baseTokenAmount.div(quoteTokenAmount).toNumber()} size="sm" symbol={tokenSymbol} />
              )}
            </StyledP>
          </StyledCalc>
        </StyledCalcMobile>
        <StyledMobile>
          <div style={{ display: 'flex', marginRight: '24px', alignItems: 'center' }}>
            <StyledIcon>{icon}</StyledIcon>
            <StyledP>
              <Value value={tokenAmountWholeLP.toNumber()} size="sm" symbol={tokenSymbol} />
            </StyledP>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StyledIcon>{quoteIcon}</StyledIcon>
            <StyledP>
              <Value value={quoteTokenAmountWholeLP.toNumber()} size="sm" symbol={quoteTokenSymbol} />
            </StyledP>
          </div>
        </StyledMobile>
      </StyledCalcDiv>

      <StyledApyDiv>
        <StyledFlexDiv>
          <StyledApy>
            <StyledApyP1>APY</StyledApyP1>
            <StyledApyP2>
              {!isNaN(apy.toNumber()) ? (
                <Value size="sm" value={apy.toNumber()} symbol="%" fontWeight={400} />
              ) : (
                'Loading ...'
              )}
            </StyledApyP2>
          </StyledApy>
          <StyledApy>
            <StyledApyP1>Daily ROI</StyledApyP1>
            <StyledApyP2>
              {!isNaN(apy.toNumber()) ? (
                <Value size="sm" value={apy ? apy.div(365).toNumber() : 'Loading ...'} symbol="%" fontWeight={400} />
              ) : (
                'Loading ...'
              )}
            </StyledApyP2>
          </StyledApy>
          <StyledApy>
            <StyledApyP1>Hourly ROI</StyledApyP1>
            <StyledApyP2>
              {!isNaN(apy.toNumber()) ? (
                <Value
                  size="sm"
                  decimals={4}
                  value={
                    apy
                      ? apy
                          .div(365)
                          .div(24)
                          .toNumber()
                      : 'Loading ...'
                  }
                  symbol="%"
                  fontWeight={400}
                />
              ) : (
                'Loading ...'
              )}
            </StyledApyP2>
          </StyledApy>
        </StyledFlexDiv>

        <StyledApyProto paddingRight="0">
          <div style={{ display: 'flex' }}>
            <StyledApyP1>Pool Supply</StyledApyP1>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '14px'
            }}
          >
            <StyledP2 paddingRight="auto" alignItems="flexEnd">
              <Value size="md2" value={dailyCOMB} symbol={`${earnToken}/DAY`} />
            </StyledP2>
            <div>
              <StyledApyP1>
                ≈ &nbsp;
                <Value size="sm" value={price.times(dailyCOMB).toNumber()} symbol="Ξ" />
              </StyledApyP1>
              <StyledApyP1>
                ≈ &nbsp;
                <Value
                  size="sm"
                  value={price
                    .times(dailyCOMB)
                    .times(etherPrice)
                    .toNumber()}
                  symbol="$"
                />
              </StyledApyP1>
            </div>
          </div>
        </StyledApyProto>
      </StyledApyDiv>
      <StyledCardContainer>
        <TotalStakedCard />
        <MyStakeCard />
      </StyledCardContainer>
    </StyledCardFarm>
  )
}

const StyledCloseButton = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  margin: 0;
  padding: 0;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 28px;
  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const StyledCalcMobile = styled.div`
  width: 62%;
  display: flex;
  margin-right: 23px;
  @media (max-width: 890px) {
    width: 100%;
    margin-right: 0;
    justify-content: space-between;
  }
  @media (max-width: 608px) {
    flex-direction: column;
    width: 100%;
    margin-right: 0;
  }
`

const StyledMobile = styled.div`
  display: flex;
  @media (max-width: 890px) {
    width: 100%;
    margin-top: 17px;
    justify-content: space-around;
  }
  @media (max-width: 500px) {
    width: 100%;
    justify-content: left;
    & > div {
      padding-right: 45px;
    }
  }
  @media (max-width: 370px) {
    & > div {
      padding-right: 0;
    }
  }
`

const StyledFlexDiv = styled.div`
  width: 57%;
  display: flex;
  justify-content: space-between;
  @media (max-width: 895px) {
    width: 100%;
  }
`

const StyledP = styled.div`
  display: flex;
  font-size: 14px;
  margin: 0;
`

const StyledCalcDiv = styled.div`
  box-sizing: border-box;
  margin: 20px 0 0 0;
  display: flex;
  align-items: center;
  @media (max-width: 890px) {
    flex-direction: column;
  }
  @media (max-width: 608px) {
    width: 100%;
    align-items: flex-start;
  }
  @media (min-width: 701px) {
    margin-bottom: 32px;
  }
`

const StyledCalc = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  border: 1px solid #ffdfbe;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 5px 40px 5px 16px;
  @media (max-width: 890px) {
    width: 50%;
  }
  :first-of-type {
    margin-right: 16px;
    @media (max-width: 608px) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
  @media (max-width: 608px) {
    width: 100%;
  }
`

const StyledApyDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 22px;
  @media (min-width: 1265px) {
    justify-content: center;
  }
  @media (min-width: 1024px) {
    justify-content: space-between;
  }
  @media (max-width: 895px) {
    flex-direction: column;
  }
  @media (max-width: 700px) {
    width: 100%;
  }
`

const StyledApy = styled.div<{ paddingRight?: string; border?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 33%;
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : '49px')};
  padding: 12px 0 10px 32px;
  background: ${({ theme }) => theme.bg6};
  border: ${({ border }) => (border ? border : '')};
  border-radius: 8px;
  margin-right: 17px;
  color: ${({ theme }) => theme.brown1};
  border: 1px solid ${({ theme }) => theme.border};
  @media (max-width: 895px) {
    padding: 12px 90px 10px 32px;
    :last-of-type {
      margin-right: 0;
    }
  }
  @media (max-width: 700px) {
    padding: 12px 0 10px 32px;
    padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : '54px')};
    margin-top: 19px;
  }
  @media (max-width: 513px) {
    padding-right: 47px;
  }
  @media (max-width: 492px) {
    padding-right: 40px;
  }
  @media (max-width: 471px) {
    padding-right: 38px;
    padding-left: 20px;
  }
  @media (max-width: 429px) {
    padding-right: 35px;
  }
  @media (max-width: 419px) {
    padding-left: 15px;
    padding-right: 30px;
    margin-right: 15px;
  }
  @media (max-width: 380px) {
    padding-left: 10px;
    padding-right: 23px;
    margin-right: 13px;
  }
`

const StyledApyProto = styled(StyledApy)`
  width: 43%;
  box-sizing: border-box;
  margin-right: 0;
  @media (max-width: 895px) {
    width: 100%;
    margin-top: 19px;
    padding: 10px 15px 4px 12px;
  }
  @media (max-width: 700px) {
    padding: 10px 15px 4px 12px;
  }
  @media (max-width: 373px) {
    div {
      & p:first-child {
        padding-right: 20px;
      }
    }
  }
`

const StyledApyP1 = styled.div<{ fontSize?: string; paddingRight?: string; paddingTop?: string; before?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0;
  font-style: normal;
  font-weight: bold;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14px')};
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : '0')};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : '0')};
  ${({ before }) =>
    before
      ? css`
          &:before {
            content: '≈';
          }
        `
      : css``};
  span {
    color: ${({ color, theme }) => (color ? color : theme.brown1)};
  }
  @media (max-width: 370px) {
    font-size: 11px;
  }
`

const StyledApyP2 = styled.div<{
  margin?: string
  alignItems?: string
  lineHeight?: string
  paddingRight?: string
  background?: string
  paddingTop?: string
}>`
  display: flex;
  position: relative;
  margin: ${({ margin }) => (margin ? margin : '0')};
  align-items: ${({ alignItems }) =>
    alignItems === 'flexEnd' ? 'flex-end' : alignItems === 'center' ? 'center' : 'baseline'};
  font-style: normal;
  font-weight: 700;
  font-size: 19px;
  line-height: ${({ lineHeight }) => (lineHeight ? lineHeight : '44px')};
  color: ${({ color, theme }) => (color ? color : theme.brown1)};
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : '0')};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : '0')};
  background: ${({ background }) => (background ? background : 'white')};
  -webkit-background-clip: text;
  span {
    color: ${({ color, theme }) => (color ? color : theme.brown1)};
    &:before {
      content: '≈';
      font-size: 14px;
    }
  }

  @media (max-width: 324px) {
    font-size: 14px;
  }
`

const StyledCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 35px;
  @media (max-width: 795px) {
    flex-direction: column;
    align-items: center;
  }
`

export default Farm

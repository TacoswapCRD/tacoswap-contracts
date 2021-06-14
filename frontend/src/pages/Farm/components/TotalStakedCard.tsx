import BigNumber from 'bignumber.js'
import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import useFarm from '../../../hooks/useFarm'
import useFarms from '../../../hooks/useFarms'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import Value from '../../../components/Value/Value'
import { StyledP, StyledP2 } from './styled'
import { ReactComponent as LogoEthereum } from '../../../assets/svg/ethereum.svg'
import { ReactComponent as DollarIcon } from '../../../assets/svg/dollar.svg'

const TotalStakedCard = () => {
  const { farmId }: any = useParams()
  const { lpToken, tokenSymbol, quoteTokenSymbol, icon, quoteIcon } = useFarm(farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    tokenSymbol: '',
    quoteTokenSymbol: '',
    earnToken: '',
    name: '',
    icon: '',
    quoteIcon: null,
    bonus: 0
  }

  const { farms } = useFarms()
  const currentFarmIndex = farms.findIndex((farm: any) => farm.id === farmId)

  const stakedValue = useAllStakedValue()

  const usdtIndex = farms.findIndex(({ lpToken }: any) => lpToken === 'USDT-ETH UNI-V2 LP')

  const etherPrice =
    usdtIndex >= 0 && stakedValue[usdtIndex]
      ? new BigNumber(1).div(stakedValue[usdtIndex].tokenPriceInWeth)
      : new BigNumber(0)

  const {
    tokenAmount = new BigNumber(0),
    quoteTokenAmount = new BigNumber(0),
    lpWethWorth = new BigNumber(0),
    totalLPTokenStaked = new BigNumber(0)
  } = stakedValue?.[currentFarmIndex] || {}

  return (
    <StyledTotalStakedCard>
      <StyledHeader>
        <StyledP>Total Staked</StyledP>
      </StyledHeader>
      <StyledContent>
        <StyledP2 paddingTop="10px">
          <Value size="md" value={totalLPTokenStaked.toNumber()} symbol={lpToken} fontWeight="700" />
        </StyledP2>
        <div style={{ display: 'flex', paddingTop: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            <StyledIcon width="22px" height="22px">
              <LogoEthereum />
            </StyledIcon>
            <StyledP paddingRight="10px" lineHeight="22px">
              {' '}
              ≈
              <Value size="sm" value={lpWethWorth.toNumber()} symbol="Ξ" />{' '}
            </StyledP>
          </div>
          <div style={{ display: 'flex' }}>
            <StyledIcon paddingLeft="10px" width="22px" height="22px">
              <DollarIcon />
            </StyledIcon>
            <StyledP lineHeight="18px">
              ≈ <Value symbol="$" size="sm" value={lpWethWorth.times(etherPrice).toNumber()} />
            </StyledP>
          </div>
        </div>
      </StyledContent>
      <StyledCardDivValues>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledIcon>{icon}</StyledIcon>
          <StyledP>
            <Value value={tokenSymbol} />
          </StyledP>
        </div>
        <StyledP>
          <Value size="sm" value={tokenAmount.toNumber()} />
        </StyledP>
      </StyledCardDivValues>
      <StyledCardDivValues>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledIcon>{quoteIcon}</StyledIcon>
          <Value value={quoteTokenSymbol} />
        </div>
        <StyledP>
          <Value size="sm" value={quoteTokenAmount.toNumber()} />
        </StyledP>
      </StyledCardDivValues>
    </StyledTotalStakedCard>
  )
}

export const StyledTotalStakedCard = styled.div`
  background: ${({ theme }) => theme.bg6};
  border-radius: 8px;
  font-size: 15px;
  padding: 16px 22px;
  width: 325px;
  margin-right: 16px;
  border: ${({ theme }) => `1px solid ${theme.border}`};
  @media (max-width: 795px) {
    width: 80%;
    position: relative;
    margin-right: 0;
    box-sizing: border-box;
    :first-of-type {
      margin-bottom: 29px;
    }
  }
  @media (max-width: 450px) {
    width: 100%;
    left: 0;
    position: static;
  }
`

const StyledHeader = styled.div`
  align-items: center;
  margin-top: 11px;
`

const StyledContent = styled.div`
  margin-bottom: 32px;
  margin-top: 10px;
`

const StyledCardDivValues = styled.div`
  border-top: 1px solid #fdcf89;
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
`

const StyledIcon = styled.div<{
  width?: string
  height?: string
  marginRight?: string
  paddingTop?: string
  paddingLeft?: string
}>`
  width: ${({ width }) => (width ? width : '21px')};
  height: ${({ height }) => (height ? height : '22px')};
  margin-right: ${({ marginRight }) => (marginRight ? marginRight : '10px')};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : '0')};
  padding-left: ${({ paddingLeft }) => (paddingLeft ? paddingLeft : '0')};
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`

export default TotalStakedCard

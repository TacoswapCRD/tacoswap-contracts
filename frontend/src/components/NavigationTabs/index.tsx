import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { resetMintState } from '../../state/mint/actions'
import QuestionHelper from '../QuestionHelper'
// import SettingsTab from 'components/Settings'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  color: ${({ theme }) => theme.brown1};
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 700;
  font-size: 26px;
  font-family: Lora;
  @media (max-width: 420px) {
    font-size: 16px;
  }
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.brown1};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ marginBottom: '20px', display: 'none' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('pool')}
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs({ title, padding }: { title?: string; padding?: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: `${padding ?? '30px 8px 20px 15px'}` }} isMobile>
        <ActiveText>{title ?? 'Swap'}</ActiveText>
        {/* {!title && <SettingsTab />} */}
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({
  adding,
  creating,
  importpool
}: {
  adding?: boolean
  creating?: boolean
  importpool?: boolean
}) {
  // reset states on back
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <Tabs>
        <RowBetween style={{ padding: '0 0 20px' }}>
          <HistoryLink
            to="/pool"
            onClick={() => {
              adding && dispatch(resetMintState())
            }}
          >
            <StyledArrowLeft />
          </HistoryLink>
          <ActiveText>
            {creating ? 'Create a pair' : adding ? 'Add Liquidity' : importpool ? 'Import Pool' : 'Remove Liquidity'}
          </ActiveText>
          <QuestionHelper
            text={
              adding
                ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
                : importpool
                ? "Use this tool to find pairs that don't automatically appear in the interface."
                : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
            }
          />
        </RowBetween>
      </Tabs>
    </>
  )
}

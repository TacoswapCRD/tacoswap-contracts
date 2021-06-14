import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  position: ${({ show }) => (!show ? 'fixed' : 'static')};
  padding-top: calc(16px + 2rem);
  padding-bottom: 16px;
  margin: 0 auto;
  margin-top: -2rem;
  width: 100%;
  max-width: 470px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.brown1};
  background: transparent;
  z-index: -999;
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-150%)')};
  transition: ${({ show }) =>
    show
      ? 'transform 500ms ease-in-out, opacity 300ms ease 200ms'
      : 'transform 500ms ease-in-out 200ms, opacity 300ms ease'};
  @media (max-width: 420px) {
    div,
    span {
      font-size: 12px !important;
    }
  }
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}

import { FindPoolTabs } from '../../components/NavigationTabs'
import { StyledFlex } from '../../components/swap/styleds'
import AppBody from '../AppBody'
import React from 'react'
import styled from 'styled-components'

import DepositPanel from './DepositPanel'
import WithdrawPanel from './WithdrawPanel'

const StyledDiv = styled.div`
  background: #ffffff;
  box-shadow: 0 0 40px rgba(255, 150, 45, 0.06);
  border-radius: 16px;
  padding: 54px 20px 58px;
  @media (max-width: 420px) {
    padding: 54px 5px 58px;
  }
`
const Stake = () => {
  return (
    <StyledFlex justifyContent="center" maxWidth="100%">
      <AppBody marginTop="88px" padding="0 19px 30px">
        <FindPoolTabs title="UTACO - xUTACO" padding="44px 0 26px" />
        <StyledDiv>
          <DepositPanel />
          <WithdrawPanel />
        </StyledDiv>
      </AppBody>
    </StyledFlex>
  )
}

export default Stake

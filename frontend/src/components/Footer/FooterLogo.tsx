import { UniIcon } from '../../pages/Farm/components/styled'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as TacoLogo } from '../../assets/logos/tacoLogo.svg'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledParagraph = styled.p<{ opacity?: number }>`
  margin: 0 0 0 19px;
  font-size: 13px;
  opacity: ${({ opacity }) => opacity && opacity};
  color: ${({ theme }) => theme.brown1};
`
function FooterLogo() {
  return (
    <Wrapper>
      <UniIcon>
        <TacoLogo />
      </UniIcon>
      <StyledParagraph>TacoSwap</StyledParagraph>
      <StyledParagraph opacity={0.5}>Powered by CRD Token</StyledParagraph>
    </Wrapper>
  )
}

export default FooterLogo

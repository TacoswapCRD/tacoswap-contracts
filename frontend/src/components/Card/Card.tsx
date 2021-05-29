import React from 'react'
import styled from 'styled-components'

interface Card {
  children?: any
  paddingBottom?: number | string
  boxShadow?: string
}

const Card = ({ children, paddingBottom, boxShadow }: Card) => (
  <StyledCard paddingBottom={paddingBottom} boxShadow={boxShadow}>
    {children}
  </StyledCard>
)

const StyledCard = styled.div<{ paddingBottom?: string | number; boxShadow?: string }>`
  padding-bottom: ${({ paddingBottom }) => (paddingBottom ? `${paddingBottom}px` : 'auto')};
  background: ${({ theme }) => theme.linear3};
  box-shadow: ${({ boxShadow }) => (boxShadow ? '' : `box-shadow: 0px 0px 16px rgba(254, 212, 148, 0.2)`)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card

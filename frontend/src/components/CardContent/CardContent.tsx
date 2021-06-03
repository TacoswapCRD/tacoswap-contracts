import React from 'react'
import styled from 'styled-components'

interface CardContent {
  children: any
  flexDirection?: string
  justifyContent?: string
  alignItems?: string
  padding?: number
  borderBottom?: string
}

const CardContent = ({ children, flexDirection, justifyContent, alignItems, padding, borderBottom }: CardContent) => (
  <StyledCardContent
    flexDirection={flexDirection}
    justifyContent={justifyContent}
    alignItems={alignItems}
    borderBottom={borderBottom}
    padding={padding}
  >
    {children}
  </StyledCardContent>
)

const StyledCardContent = styled.div<{
  alignItems?: string
  borderBottom?: string
  flexDirection?: string
  justifyContent?: string
  padding?: number
}>`
  flex-direction: ${({ flexDirection }) => (flexDirection ? flexDirection : ' column')};
  justify-content: ${({ justifyContent }) => justifyContent};
  display: flex;
  align-items: ${({ alignItems }) => alignItems};
  border-bottom: ${({ borderBottom }) => borderBottom};
  flex: 1;
  padding: ${({ padding }) => (padding ? padding : 16)}px;
`

export default CardContent

import React from 'react'
import styled from 'styled-components'

const Spacer = ({ size = 'md' }: any) => {
  let s
  switch (size) {
    case 'lg':
      s = 26
      break
    case 'sm':
      s = 14
      break
    case 'sm2':
      s = 17
      break
    case 'md':
    default:
      s = 24
  }
  return <StyledSpacer size={s} />
}
const StyledSpacer = styled.div<{ size?: number }>`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`
export default Spacer

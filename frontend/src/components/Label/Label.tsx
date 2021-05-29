import React from 'react'
import styled from 'styled-components'

const Label = ({ text }: any) => <StyledLabel>{text}</StyledLabel>

const StyledLabel = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 24px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

export default Label

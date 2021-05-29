import React from 'react'
import styled from 'styled-components'

import Spacer from '../Spacer'

interface ModalActions {
  children?: any
  flex?: any
  padding?: any
}

const ModalActions = ({ children, flex, padding }: ModalActions) => {
  const l = React.Children.toArray(children).length
  return (
    <StyledModalActions padding={padding}>
      {React.Children.map(children, (child, i) => (
        <>
          <StyledModalAction flex={flex}>{child}</StyledModalAction>
          {i < l - 1 && <Spacer />}
        </>
      ))}
    </StyledModalActions>
  )
}

const StyledModalActions = styled.div<{ padding?: any }>`
  align-items: space-between;
  display: flex;
  margin: 0;
  justify-content: center;
  padding: ${({ padding }) => (padding ? padding : '24px')};
`

const StyledModalAction = styled.div<{ flex?: any }>`
  flex: ${({ flex }) => (flex ? flex : 1)};
`

export default ModalActions

import React from 'react'
import styled from 'styled-components'
// import { CloseIcon } from 'theme'
import { ReactComponent as CloseIcon } from '../../../../assets/images/x.svg'

interface ModalTitle {
  text?: string
  height?: number
  onDismiss?: () => void
}

const ModalTitle = ({ text, height, onDismiss }: ModalTitle) => (
  <>
    <StyledIconWrapper onClick={onDismiss}>
      <CloseIcon />
    </StyledIconWrapper>
    <StyledModalTitle height={height}>{text}</StyledModalTitle>
  </>
)

const StyledModalTitle = styled.div<{ height?: any }>`
  align-items: center;
  color: ${({ theme }) => theme.brown1};
  display: flex;
  font-size: 18px;
  font-weight: 700;
  height: ${({ height }) => (height ? height : '')}px;
  justify-content: center;
  text-align: center;
`
const StyledIconWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  cursor: pointer;
  padding-top: 24px;
  svg {
    height: 21px;
    width: 21px;
    font-size: 16px;
    stroke: ${({ theme }) => theme.brown1};
  }
  @media (max-width: 768px) {
    padding: 24px 24px 0 0;
  }
  @media (max-width: 576px) {
    margin-right: 10px;
    width: 96%;
    padding-top: 20px;
    padding-bottom: 10px;
  }
`

export default ModalTitle

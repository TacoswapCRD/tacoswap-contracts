import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-weight: 400;
  padding: 0.35rem 0.6rem;
  background: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? theme.linear2 : '#DFDCDD') : 'transparent'};
  color: ${({ isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? 'white' : 'white') : '#614E56')};
  font-size: 12px;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  margin-top: 13px;
  border-radius: 8px;
  border: 1px solid rgba(97, 78, 86, 0.2);
  background: transparent;
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
        Off
      </ToggleElement>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        On
      </ToggleElement>
    </StyledToggle>
  )
}

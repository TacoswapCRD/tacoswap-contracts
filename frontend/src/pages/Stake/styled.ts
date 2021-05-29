import styled from 'styled-components'

export const Container = styled.div<{ marginBottom?: string }>`
  border-radius: 8px;
  background: #fff5ea;
  padding: 22px 36px 22px 20px;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? '40px'};
  @media (max-width: 420px) {
    padding: 10px;
  }
`
export const StyledButtonPrimary = styled.button`
  background: ${({ theme }) => theme.buttonLinear};
  border: none;
  color: #ffffff;
  padding: 13px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 24px;
  width: 170px;

  &:hover:enabled {
    background: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.hoverText};
    box-shadow: none;
  }
  &:focus {
    color: #ffffff;
    box-shadow: ${({ theme }) => `0px 0px 10px 0px${theme.backgroundHover}`};
    background: ${({ theme }) => theme.buttonLinear};
    outline: none;
  }
  &:active {
    color: #ffffff;
    box-shadow: ${({ theme }) => `0px 15px 10px ${theme.backgroundHover}, 0px -15px 10px ${theme.backgroundHover}`};
    background: ${({ theme }) => theme.buttonLinear};
  }

  &:disabled {
    cursor: auto;
    box-shadow: none;
    outline: none;
    opacity: 0.5;
    background: ${({ theme }) => theme.disable};
    color: #ffffff;
  }
  @media (max-width: 420px) {
    width: 100px;
    padding: 8px 5px;
    font-size: 14px;
  }
`

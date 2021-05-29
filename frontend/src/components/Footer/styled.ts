import styled from 'styled-components'

export const StyledLink = styled.a`
  margin: 0 16px;
  text-decoration: none;
  width: 17px;
  height: 19px;
  color: ${({ theme }) => theme.brown1};
  cursor: pointer;
  &:hover {
    svg {
      opacity: 0.6;
    }
  }
  img,
  svg {
    height: 100%;
    width: 100%;
  }
  svg path {
    fill: ${({ theme }) => theme.brown1};
  }
`

export const StyledFooter = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 660px) {
    padding: 0;
    flex-direction: column;
    align-items: center;
    > div:nth-child(2) {
      order: -1;
      padding-top: 19px;
    }
  }
`

export const StyledNav = styled.div`
  display: flex;
  box-sizing: border-box;
  max-width: 1440px;
  padding: 15px 0;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  @media (max-width: 660px) {
    flex-direction: column-reverse;
    width: 100%;
    padding: 15px 0 0;
  }
`

export const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  border-top: 1px solid #faddbc;
`

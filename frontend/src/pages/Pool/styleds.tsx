import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div<{ width?: string; padding?: string }>`
  width: ${({ width }) => (width ? width : '')};
  position: relative;
  padding: ${({ padding }) => padding ?? '25px 32px 52px'};
  border-radius: 11px;
`

export const BottomGrouping = styled.div`
  display: flex;
  justify-content: center;
  button {
    width: 100%;
  }
`

export const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.hoverText};
  :hover {
    cursor: pointer;
  }
`
export const MaxButton = styled.button<{ width?: string }>`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.linear1};
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.white};
  :hover {
    border: 1px solid ${({ theme }) => theme.border};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

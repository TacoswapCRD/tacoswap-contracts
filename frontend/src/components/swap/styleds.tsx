import { transparentize } from 'polished'
import React from 'react'
import { AlertTriangle } from 'react-feather'
import styled, { css } from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from '../Column'

export const StyledFlex = styled.div<{ alignItems?: string; justifyContent?: string; maxWidth?: string; mb?: string }>`
  display: flex;
  align-items: ${({ alignItems }) => (alignItems ? alignItems : '')};
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '978px')};
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : 'space-around')};
  margin-bottom: ${({ mb }) => (mb ? mb : '30px')};
`

export const StyledLogoDiv = styled.div`
  position: relative;
  display: flex;
  width: 366px;
  height: 366px;
  margin-top: 30px;
  -moz-box-pack: center;
  justify-content: center;
  -moz-box-align: center;
  align-items: center;
  .borderOuter,
  .borderInner,
  .heroInner {
    position: absolute;
  }

  img {
    width: 100%;
  }
  .borderOuter {
    top: 0;
    left: 0;
  }
  .borderInner {
    padding: 22px 21px 18px 19px;
  }
  .heroInner {
    padding: 53.5px 51px 47px 49px;
  }
  @media (max-width: 800px) {
    display: none;
  }
`

export const Wrapper = styled.div<{ width?: string; padding?: string; noShadow?: boolean }>`
  width: ${({ width }) => (width ? width : '')};
  position: relative;
  padding: ${({ padding }) => padding ?? '52px 20px'};

  border-radius: 11px;
  box-shadow: ${({ noShadow }) => !noShadow && '0 0 40px rgba(255, 150, 45, 0.06)'};
  @media (max-width: 420px) {
    padding: 27px 11px 12px;
  }
`

export const ArrowWrapper = styled.div<{ clickable: boolean; trigger?: boolean }>`
  padding: 2px;
  transition: all ease 0.8s;
  ${({ trigger }) =>
    trigger
      ? css`
          transform: rotate(0deg);
        `
      : css`
          transform: rotate(-180deg);
        `}

  @media (max-width: 420px) {
    svg {
      width: 22px;
      height: 20px;
    }
  }
  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export const SectionBreak = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.border2};
`

export const BottomGrouping = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  button {
    width: 100%;
    font-size: 18px;
    div {
      font-size: 18px;
    }
  }
  @media (max-width: 420px) {
    margin-top: 16px;
    button {
      width: 100%;
      font-size: 14px;
      height: 42px;
      div {
        font-size: 14px;
      }
    }
  }
`

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.red1
      : severity === 2
      ? theme.yellow2
      : severity === 1
      ? theme.text1
      : theme.green1};
`

export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background-color: rgb(25, 33, 57);
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text3};
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
    background-color: ${({ theme }) => theme.text2};
  }
  :focus {
    background-color: ${({ theme }) => theme.text2};
    outline: none;
  }
`

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`

// styles
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

const SwapCallbackErrorInner = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.red1)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.red1};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.red1)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function SwapCallbackError({ error }: { error: string }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <AlertTriangle size={24} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  )
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: ${({ theme }) => transparentize(0.9, theme.primary1)};
  color: ${({ theme }) => theme.primary1};
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

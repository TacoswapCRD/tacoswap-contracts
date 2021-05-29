import React from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'
import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import Button from './Button'

const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
  fontSize?: string
  fontWeight?: number
}>`
  padding: ${({ padding }) => (padding ? padding : '21px 41px')};
  width: ${({ width }) => (width ? width : '')} !important;
  font-weight: ${({ fontWeight }) => fontWeight ?? '500'};
  text-align: center;
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '62px')};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  font-size: ${({ fontSize }) => fontSize ?? '18px'};
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)<{
  bgcolor?: string
  bghover?: boolean
  altDisabledStyle?: boolean
  padding?: any
}>`
  background: ${({ bgcolor, theme }) => (bgcolor ? bgcolor : theme.buttonLinear)};
  border: none;
  color: #ffffff;
  padding: ${({ padding }) => padding && padding};

  &:hover {
    background: ${({ theme }) => theme.backgroundHover};
    &:focus {
      box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.yellow1)};
    }
    &:hover:enabled {
      background: ${({ bghover, theme }) => (bghover ? 'rgb(25, 102, 212)' : theme.backgroundHover)};
      color: ${({ theme }) => theme.hoverText};
      box-shadow: none;
    }
    &:focus {
      color: #ffffff;
      box-shadow: ${({ theme }) => `0px 0px 10px 0px${theme.backgroundHover}`};
      background: ${({ bgcolor, theme }) => (bgcolor ? bgcolor : theme.buttonLinear)};
    }
    &:active {
      color: #ffffff;
      box-shadow: ${({ theme }) => `0px 15px 10px ${theme.backgroundHover}, 0px -15px 10px ${theme.backgroundHover}`};
      background: ${({ bgcolor, theme }) => (bgcolor ? bgcolor : theme.buttonLinear)};
    }
    &:disabled {
      cursor: auto;
      box-shadow: none;
      outline: none;
      opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
      background: ${({ theme }) => theme.disable};
      color: #ffffff;
    }
  }
`
export const ButtonPrimaryProto = styled(ButtonPrimary)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.blue1};
  width: ${({ width }) => width && width};
  &:disabled {
    cursor: auto;
    box-shadow: none;
    background: ${({ theme }) => theme.disable};
  }
`

export const ButtonLight = styled(Base)`
  background-color: rgb(52, 57, 60);
  color: #fff;
  font-weight: 500;
  &:hover {
    background: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.hoverText};
  }
  &:disabled {
    opacity: 0.4;
    background: ${({ theme }) => theme.disable};
    &:hover {
      cursor: auto;
      box-shadow: none;
      outline: none;
    }
  }
`

export const ButtonSignOut = styled(Button)`
  :hover {
    opacity: 0.8;
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  &:focus {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg4)};
  }
`

export const ButtonSecondary = styled(Base)`
  background-color: transparent;
  border: 1px solid #00d395;
  font-size: 16px;
  border-radius: 12px;
  color: #fff;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    :active {
      border: 1px solid rgb(77, 143, 234);
    }
  }
  &:hover {
    :active {
      border: 1px solid rgb(77, 143, 234);
    }
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonUNIGradient = styled(ButtonPrimary)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
  width: fit-content;
  position: relative;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid rgb(25, 33, 57);
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: rgb(86, 90, 105) 0 0 0 1px;
  }
  &:hover {
    box-shadow: rgb(86, 90, 105) 0 0 0 1px;
  }
  &:active {
    box-shadow: rgb(86, 90, 105) 0 0 0 1px;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.bg1};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    background: ${({ theme }) => theme.disable};
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    background: ${({ theme }) => theme.disable};
    color: #ffffff;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background: ${({ theme }) => theme.buttonLinear};

  &:focus {
    background-color: ${({ theme }) => theme.pressed};
  }
  &:hover {
    background: ${({ theme }) => theme.backgroundHover};
  }
  &:active {
    background: ${({ theme }) => theme.buttonLinear};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background: ${({ theme }) => theme.disable};
  }
`

export const BorderedButton = styled(Button)<{ width?: string }>`
  border-radius: 24px;
  padding: 12px 36px;
  border: 1px solid #ee9f47;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.border} !important;
  :hover {
    color: ${({ theme }) => theme.white};
  }

  @media (max-width: 720px) {
    width: 42%;
  }
`
export const ButtonLightProto = styled(Base)`
  background: #fff5ea;
  color: ${({ theme }) => theme.brown1};
  border-radius: 8px;
  padding: 34px 20px;
  &:focus {
    box-shadow: ${({ theme }) => `${theme.border2} 0 0 0 1px`};
  }
  &:hover {
    box-shadow: ${({ theme }) => `${theme.border2} 0 0 0 1px`};
  }
  &:active {
    box-shadow: ${({ theme }) => `${theme.border2} 0 0 0 1px`};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`
export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimaryProto {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownGrey({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: '20px' }}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonGray>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonLightProto {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonLightProto>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

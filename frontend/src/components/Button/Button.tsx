import React from 'react'
import styled, { css } from 'styled-components'

import { Link } from 'react-router-dom'
import useTheme from '../../hooks/useTheme'

interface Button {
  children?: any
  disabled?: boolean
  href?: any
  onClick?: () => void
  size?: any
  text?: any
  to?: any
  variant?: string
  minWidth?: number
  maxWidth?: number
  borderRadius?: string
  background?: string
  backgroundPressed?: string
  boxShadow?: string
  hoverBackground?: string
  border?: string
  width?: string
  secondary?: boolean
  primary?: boolean
  butColor?: boolean
  paddingLeft?: number | string
  paddingRight?: number | string
  margin?: string
  fontSize?: number
  hoverColor?: string
  hoverUnderline?: boolean
  padding?: number
  fontWeight?: string
  as?: any
  specialHover?: boolean
  media?: boolean
}

const Button = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  variant,
  minWidth,
  maxWidth,
  borderRadius,
  background,
  backgroundPressed,
  hoverBackground,
  border,
  width,
  secondary,
  primary,
  butColor,
  paddingLeft,
  paddingRight,
  margin,
  fontSize,
  hoverColor,
  hoverUnderline,
  as,
  specialHover,
  media
}: Button) => {
  const theme = useTheme()
  let fontWeight: any
  let buttonColor: any
  let buttonSize: any
  let buttonPadding: any
  let boxShadow: string
  switch (variant) {
    case 'secondary':
      buttonColor = theme.border
      boxShadow = '0px 4px 4px #F7C89D'
      hoverColor = theme.white
      hoverBackground = theme.linear1
      break
    case 'default':
    default:
      buttonColor = '#fff'
  }
  switch (size) {
    case 'sm':
      buttonPadding = '0 23px'
      buttonSize = 35
      fontSize = 14
      break
    case 'lg':
      buttonPadding = '0 41px'
      buttonSize = 52
      fontSize = 14
      break
    case 'md':
      buttonPadding = '0 35px'
      fontSize = 14
      buttonSize = 48
      break
    case 'icon-button':
      buttonPadding = '0'
      width = '52px'
      fontSize = 14
      buttonSize = 52
      border = `1px solid ${theme.border}`
      break
    case 'header-button':
      buttonPadding = '6px 29px'
      buttonSize = 'auto'
      fontSize = 14
      break
    case 'signout-button':
      buttonSize = 48
      fontSize = 14
      border = `1px solid ${theme.brown1}`
      buttonColor = theme.brown1
      break
    case 'fs-18':
      buttonPadding = '4px'
      buttonSize = 65
      fontSize = 18
      break
    case 'add':
      buttonPadding = '0'
      buttonSize = 42
      fontSize = 14
      break
    default:
      buttonPadding = '4px'
      buttonSize = 65
      fontSize = 14
  }

  if (secondary) {
    background = 'transparent'
    border = `1px solid ${theme.border}`
    hoverBackground = theme.buttonLinear
    hoverColor = 'none'
  }

  if (primary) {
    background = 'transparent'
    border = `1px solid ${theme.border}`
    buttonColor = theme.border
    hoverBackground = theme.buttonLinear
    hoverColor = theme.white
  }

  if (butColor) {
    buttonColor = '#FF962D'
    fontWeight = '400'
  }

  const ButtonChild = () => {
    if (to) {
      return (
        <StyledButton
          boxShadow={boxShadow}
          color={buttonColor}
          disabled={disabled}
          fontSize={fontSize}
          onClick={onClick}
          padding={buttonPadding}
          size={buttonSize}
          minWidth={minWidth}
          maxWidth={maxWidth}
          background={background}
          backgroundPressed={backgroundPressed}
          hoverBackground={hoverBackground}
          border={border}
          width={width}
          secondary={secondary}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          margin={margin}
          borderRadius={borderRadius}
          fontWeight={fontWeight}
          hoverColor={hoverColor}
          hoverUnderline={hoverUnderline}
          as={as}
          specialHover={specialHover}
        >
          <StyledLink to={to}>{text}</StyledLink>
        </StyledButton>
      )
    } else if (href) {
      return (
        <StyledButton
          boxShadow={boxShadow}
          color={buttonColor}
          disabled={disabled}
          fontSize={fontSize}
          onClick={onClick}
          padding={buttonPadding}
          size={buttonSize}
          minWidth={minWidth}
          maxWidth={maxWidth}
          background={background}
          backgroundPressed={backgroundPressed}
          hoverBackground={hoverBackground}
          border={border}
          width={width}
          secondary={secondary}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          margin={margin}
          borderRadius={borderRadius}
          fontWeight={fontWeight}
          hoverColor={hoverColor}
          hoverUnderline={hoverUnderline}
          specialHover={specialHover}
        >
          <StyledExternalLink href={href} target="__blank">
            {text}
          </StyledExternalLink>
        </StyledButton>
      )
    } else {
      return (
        <StyledButton
          boxShadow={boxShadow}
          color={buttonColor}
          disabled={disabled}
          fontSize={fontSize}
          onClick={onClick}
          padding={buttonPadding}
          size={buttonSize}
          minWidth={minWidth}
          maxWidth={maxWidth}
          background={background}
          backgroundPressed={backgroundPressed}
          hoverBackground={hoverBackground}
          border={border}
          width={width}
          secondary={secondary}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          margin={margin}
          borderRadius={borderRadius}
          fontWeight={fontWeight}
          hoverColor={hoverColor}
          hoverUnderline={hoverUnderline}
          specialHover={specialHover}
          media={media}
        >
          <>{text}</>
        </StyledButton>
      )
    }
  }
  return (
    <>
      {children ? (
        <StyledButton
          color={buttonColor}
          disabled={disabled}
          fontSize={fontSize}
          onClick={onClick}
          padding={buttonPadding}
          size={buttonSize}
          minWidth={minWidth}
          maxWidth={maxWidth}
          background={background}
          backgroundPressed={backgroundPressed}
          hoverBackground={hoverBackground}
          border={border}
          width={width}
          secondary={secondary}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          margin={margin}
          borderRadius={borderRadius}
          fontWeight={fontWeight}
          hoverColor={hoverColor}
          hoverUnderline={hoverUnderline}
          specialHover={specialHover}
        >
          <>{children}</>
        </StyledButton>
      ) : (
        <ButtonChild />
      )}
    </>
  )
}

const StyledButton = styled.button<Button>`
  box-sizing: border-box;
  position: relative;
  align-items: center;
  background-size: cover;
  background-position: center left;
  border: ${props => (props.border ? props.border : 'none')};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '62px')};
  background: ${({ theme, background, disabled }) =>
    background ? background : disabled ? '#DBD8D9' : theme.buttonLinear};
  box-shadow: ${({ boxShadow }) => (boxShadow ? boxShadow : '')};
  color: ${props => (props.color ? props.color : '#fff')};
  cursor: pointer;
  display: flex;
  padding: ${({ padding }) => padding};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '700')};
  height: ${props => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: ${({ paddingLeft }) => paddingLeft}px;
  padding-right: ${({ paddingRight }) => paddingRight}px;
  position: relative;
  margin: ${({ margin }) => (margin ? margin : '')};
  pointer-events: ${props => (!props.disabled ? undefined : 'none')};
  min-width: ${props => props.minWidth}px;
  max-width: ${props => props.maxWidth}px;
  white-space: nowrap;
  width: ${props => (props.width ? `${props.width}` : '100%')};
  &:hover {
    background: ${({ hoverBackground, theme }) => (hoverBackground ? hoverBackground : theme.backgroundHover)};
    color: ${({ hoverColor, theme }) => (hoverColor ? hoverColor : theme.hoverText)};
    background-position: bottom right;
    transition: background-position 0.3s;
    > a {
      text-decoration: ${({ hoverUnderline }) => (hoverUnderline ? 'underline' : 'none')};
    }
  }
  ${({ specialHover, background }) =>
    specialHover &&
    css`
      &:hover {
        background: ${({ theme }) => theme.backgroundHover};
        color: ${({ theme }) => theme.hoverText};
        box-shadow: none;
      }
      &:focus {
        color: #ffffff;
        box-shadow: ${({ theme }) => `0px 0px 10px 0px${theme.backgroundHover}`};
        background: ${background};
      }
      &:active {
        color: #ffffff;
        box-shadow: ${({ theme }) => `0px 15px 10px ${theme.backgroundHover}, 0px -15px 10px ${theme.backgroundHover}`};
        background: ${background};
      }
      &:disabled {
        box-shadow: none;
        outline: none;
        background: ${({ theme }) => theme.disable};
        color: #ffffff;
      }
    `};
  @media (max-width: 420px) {
    width: ${({ media }) => media && '100px'};
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  width: 100%;
`

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  justify-content: center;
  text-decoration: none;
  width: 100%;
  height: 100%;
`

export default Button

import React from 'react'
import styled, { css } from 'styled-components'

interface PageHeader {
  icon?: any
  subtitle?: string
  title?: string
  padding?: string
  flexDirection?: string
  titleColor?: string
  margin?: string
  subtitleMargin?: string
  size?: string
}

const PageHeader = ({
  icon,
  subtitle,
  title,
  padding,
  flexDirection,
  titleColor,
  margin,
  subtitleMargin
}: PageHeader) => {
  return (
    <StyledPageHeader margin={margin} flexDirection={flexDirection} padding={padding}>
      <StyledHeader>
        {icon && <StyledIcon>{icon}</StyledIcon>}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {title && <StyledTitle titleColor={titleColor}>{title}</StyledTitle>}
          {subtitle && <StyledSubtitle subtitleMargin={subtitleMargin}>{subtitle}</StyledSubtitle>}
        </div>
      </StyledHeader>
    </StyledPageHeader>
  )
}

export const PageHeaderProto = ({ icon, subtitle, title, padding, flexDirection, size }: PageHeader) => {
  return (
    <StyledPageHeaderProto flexDirection={flexDirection} padding={padding}>
      <StyledHeader>
        {icon && <StyledIcon size={size}>{icon}</StyledIcon>}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {title && <StyledTitleProto>{title}</StyledTitleProto>}
          {subtitle && <StyledSubtitleProto>{subtitle}</StyledSubtitleProto>}
        </div>
      </StyledHeader>
    </StyledPageHeaderProto>
  )
}

const StyledPageHeader = styled.div<{ flexDirection?: string; padding?: string; margin?: string }>`
  align-items: left;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: ${({ flexDirection }) => (flexDirection ? flexDirection : 'column')};
  padding: ${({ padding }) => (padding ? padding : '48px 0')};
  margin: ${({ margin }) => (margin ? margin : '0')};
  width: 100%;
  max-width: 1152px;
`

const StyledIcon = styled.div<{ size?: string; flex?: boolean }>`
  height: 54px;
  margin-right: 24px;
  width: 45px;
  line-height: 50px;
  text-align: center;
  font-size: ${({ size }) => (size ? size : '')};
  img {
    width: 100%;
    width: 100%;
  }
  svg {
    width: 100%;
    width: 100%;
  }
  ${({ flex }) =>
    flex &&
    css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 0;
    `}
`

export const StyledPageHeaderProto = styled(StyledPageHeader)``

const StyledHeader = styled.div`
  display: flex;
`

const StyledTitle = styled.h1<{ titleColor?: string; margin?: string }>`
  color: ${({ titleColor, theme }) => (titleColor ? titleColor : theme.brown1)};
  font-size: 36px;
  font-weight: 700;
  font-family: 'Lora', serif;
  line-height: 30px;
  margin: ${({ margin }) => (margin ? margin : '0')};
  padding: 0;
  @media (max-width: 900px) {
    font-size: 28px;
  }
  @media (max-width: 475px) {
    font-size: 20px;
  }
`

const StyledTitleProto = styled(StyledTitle)`
  margin: 12px 0 8px;
  font-size: 24px;
`

const StyledSubtitle = styled.h3<{ subtitleMargin?: string }>`
  color: ${({ theme }) => theme.brown1};
  font-size: 24px;
  font-weight: 400;
  line-height: 17px;
  margin: ${({ subtitleMargin }) => (subtitleMargin ? subtitleMargin : '8px 0 0 0')};
  padding: 0;
  text-align: left;
  @media (max-width: 475px) {
    font-size: 14px;
  }
`

const StyledSubtitleProto = styled(StyledSubtitle)`
  font-size: 14px;
`

export default PageHeader

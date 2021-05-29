import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div<{ padding?: string }>`
  position: relative;
  max-width: 592px;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  padding: ${({ padding }) => padding ?? '0 20px 20px'};
  border-radius: 16px;
  background-clip: padding-box;
  ::after {
    position: absolute;
    top: -3px;
    bottom: -3px;
    left: -3px;
    right: -3px;
    background: linear-gradient(270deg, rgb(254, 254, 255), rgb(255, 245, 234));
    content: '';
    z-index: -1;
    border-radius: 16px;
  }
  @media (max-width: 420px) {
    padding: 23px 10px;
    max-width: 296px;
  }
  @media (max-width: 600px) {
    width: 95%;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  marginTop,
  padding
}: {
  children: React.ReactNode
  marginTop?: string
  padding?: string
}) {
  return (
    <BodyWrapper padding={padding} style={{ marginTop: `${marginTop}` }}>
      {children}
    </BodyWrapper>
  )
}

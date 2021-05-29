import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
`

const BodyWrapper = styled.div<{ paddingTop?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  z-index: 1;
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : '81px')};
  height: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 1rem;
  `};
  @media (max-width: 470px) {
    padding: 2rem 0 16px 0;
  }
`

interface Layout {
  children: ReactNode
  top?: number
  paddingTop?: string
}

const Layout: FC<Layout> = ({ children, paddingTop }: Layout) => {
  return (
    <>
      <AppWrapper>
        <Header />
        <BodyWrapper paddingTop={paddingTop}>{children}</BodyWrapper>
        <Footer />
      </AppWrapper>
    </>
  )
}

export default Layout

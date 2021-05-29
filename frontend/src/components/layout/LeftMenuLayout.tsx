import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink, useHistory } from 'react-router-dom'

import Header from '../Header'

// SVG
import Footer from '../Footer'
// import LeftSideMenuIcon from 'components/LeftSideMenuIcon/LeftSideMenuIcon'
import { ReactComponent as SquareFour } from '../../assets/svg/SquaresFour.svg'
import { ReactComponent as ChartPie } from '../../assets/svg/ChartPie.svg'
import { ReactComponent as FileText } from '../../assets/svg/FileText.svg'
import { ReactComponent as ChartLine } from '../../assets/svg/ChartLine.svg'

type LeftMenuItems = {
  name: string
  location: string
  icon: React.ReactNode | string
}

export const LEFT_MENU_ITEMS: LeftMenuItems[] = [
  { name: 'Dashboard', location: '/dashboard', icon: <SquareFour /> },
  { name: 'Pool', location: '/pool', icon: <ChartPie /> },
  { name: 'Farm', location: '/farms', icon: <FileText /> },
  { name: 'Stake', location: '/stake', icon: <ChartLine /> }
]

const StyledContainer = styled.div`
  display: flex;
  position: relative;
  height: calc(100vh - 72px);
`

const StyledLeftSideMenuContainer = styled(StyledContainer)<{ trigger: boolean }>`
  flex-direction: column;
  height: auto;
  background: ${({ theme }) => theme.bg4};
  justify-content: flex-start;
  align-items: center;
  width: 23%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid #faddbc;
  @media (max-width: 1200px) {
    z-index: 3;
    width: 290px;
    border-radius: 0 20px 12px 0;
    transform: ${({ trigger }) => (trigger ? 'translateX(0)' : 'translateX(-300px)')};
    transition: all 0.3s ease;
    border: none;
  }
`

const StyledChildrenContainer = styled.div`
  padding-left: 23%;
  width: 100%;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  @media (max-width: 1200px) {
    padding: 0;
  }
`

const StyledChild = styled.div<{ minHeight?: boolean }>`
  min-height: calc(100vh - 131px);
  overflow-x: hidden;
  overflow-y: auto;
  @media (max-width: 660px) {
    min-height: calc(100vh - 240px);
  }
`

const StyledListContainer = styled.div`
  display: flex;
  margin-top: 81px;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const StyledListItem = styled.div<{ isActive: boolean }>`
  width: 53%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 42px;
  svg {
    margin-right: 20px;
    path {
      stroke: ${({ theme, isActive }) => (isActive ? '#F4B740' : theme.brown1)};
    }
  }
`

const activeClassName = 'Active'

const StyledNavLink = styled(NavLink).attrs({ activeClassName })`
  text-decoration: none;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.brown1};

  &.${activeClassName} {
    font-weight: bold;
  }
`

interface LeftMenuLayout {
  title?: string
  minHeight?: boolean
  children: React.ReactNode
}

const LeftMenuLayout: React.FC<LeftMenuLayout> = ({ children, minHeight }: LeftMenuLayout) => {
  const [trigger, setTrigger] = useState<boolean>(false)
  const {
    push,
    location: { pathname }
  } = useHistory()
  return (
    <>
      <Header />
      <StyledContainer>
        <StyledLeftSideMenuContainer trigger={trigger}>
          <StyledListContainer>
            {LEFT_MENU_ITEMS.map(({ name, icon, location }) => (
              <StyledListItem
                isActive={location === pathname}
                onClick={() => push(location)}
                key={`${name}/${location}`}
              >
                {icon}
                <StyledNavLink to={location}>{name}</StyledNavLink>
              </StyledListItem>
            ))}
          </StyledListContainer>
        </StyledLeftSideMenuContainer>
        <StyledChildrenContainer>
          {/* <LeftSideMenuIcon trigger={trigger} setTrigger={() => setTrigger(prev => !prev)} /> */}
          <StyledChild minHeight={minHeight}>{children}</StyledChild>
          <Footer />
        </StyledChildrenContainer>
      </StyledContainer>
    </>
  )
}

export default LeftMenuLayout

import Button from '../Button/Button'
import React from 'react'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'

const InfoCard = styled(Button as any)<{ active?: boolean; clickable?: boolean }>`
  background-color: ${({ theme, active }) => (active ? theme.bg3 : theme.bg2)};
  outline: none;
  border-color: ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
  }
`

const OptionCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean; media?: boolean }>`
  margin-top: 0;
  background: transparent;
  color: ${({ theme }) => theme.white};
  border: none;
  :not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  @media (max-width: 420px) {
    padding: 1rem 5px;
  }
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  color: ${({ theme }) => theme.brown1};
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`

const SubHeader = styled.div`
  color: ${({ theme }) => theme.white};
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  margin-right: 23px;
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
  @media screen and (max-width: 420px) {
    margin-right: 5px;
  }
`

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: () => void
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <OptionCardClickable id={id}>
      <OptionCardLeft>
        <IconWrapper size={size}>
          <img src={icon} alt={'Icon'} />
        </IconWrapper>
        <HeaderText color={color}>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          {header}
          {subheader && <SubHeader>{subheader}</SubHeader>}
        </HeaderText>
      </OptionCardLeft>
      <InfoCard media width="150px" size="md" onClick={onClick} clickable={clickable && !active} active={active}>
        Connect
      </InfoCard>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}

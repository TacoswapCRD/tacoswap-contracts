import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{
  color?: string
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
  backGround?: string
}>`
  width: ${({ width }) => width ?? ''};
  background: ${({ backGround }) => backGround};
  padding: ${({ padding }) => padding || '1.25rem'};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius || '24px'};
  color: ${({ color }) => color && color};
`
export default Card

export const LightCard = styled(Card)`
  background: ${({ theme }) => theme.white};
`

export const GreyCard = styled(Card)`
  background-color: rgb(25, 33, 57) none repeat scroll 0% 0%;
  border-radius: 62px;
`

export const OutlineCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.text3};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background: ${({ theme }) => theme.bg5};
  color: ${({ theme }) => theme.brown1};
  border-radius: 12px;
  width: 100%;
  text-align: center;
`

export const OutlinedCard = styled(Card)`
  border: ${({ theme }) => `1px solid ${theme.border2}`};
  border-radius: 8px;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500}>{children}</Text>
    </BlueCardStyled>
  )
}

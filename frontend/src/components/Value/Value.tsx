import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'

interface Value {
  value?: any
  decimals?: number
  symbol?: string
  size?: string
  fontWeight?: any
}

const Value = ({ value, decimals, symbol, size, fontWeight }: Value) => {
  const [start, updateStart] = useState(0)
  const [end, updateEnd] = useState(0)

  useEffect(() => {
    if (typeof value === 'number') {
      updateStart(prev => prev)
      updateEnd(() => value)
    }
  }, [value])

  return (
    <StyledValue
      fontWeight={size === 'lg' ? 700 : fontWeight}
      fontSize={size === 'sm' ? 14 : size === ('md' || 'md2') ? 22 : size === 'lg' ? 34 : 11}
      smallFontSize={size === 'sm' || 'md2' ? 'inherit' : '.65em'}
    >
      {typeof value == 'string' ? (
        <>
          {symbol && symbol.includes('$') ? <span style={{ marginRight: '4px' }}>{symbol}</span> : null}
          {value}
          {symbol && !symbol.includes('$') ? <small style={{ marginLeft: '4px' }}>{symbol}</small> : null}
        </>
      ) : (
        <>
          {symbol && symbol.includes('$') ? <span style={{ marginRight: '4px' }}>{symbol}</span> : null}
          <CountUp
            duration={2}
            start={start}
            end={end}
            decimals={decimals !== undefined ? decimals : end < 0 ? 4 : end > 1e5 ? 0 : 2}
            separator=","
          />
          {symbol && !symbol.includes('$') ? <small style={{ marginLeft: '4px' }}>{symbol}</small> : null}
        </>
      )}
    </StyledValue>
  )
}

const StyledValue = styled.div<{ fontSize?: any; fontWeight?: string; smallFontSize?: any }>`
  font-size: ${props => Math.max(12, props.fontSize * 0.75)}px;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 'normal')};
  @media (min-width: 1300px) {
    font-size: ${props => props.fontSize}px;
  }

  small {
    font-size: ${({ smallFontSize }) => smallFontSize};
  }
`

export default Value

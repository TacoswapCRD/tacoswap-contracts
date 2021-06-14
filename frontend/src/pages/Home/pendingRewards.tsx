import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import useAllEarnings from '../../hooks/useAllEarnings'
export const PendingRewards = ({ accountModalPendingRewards }: any) => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (const earning of allEarnings) {
    sumEarning += new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning, end])

  return (
    <>
      {accountModalPendingRewards ? (
        <StyledAccountPendingRewardsContainer>
          Unclaimed:{' '}
          <CountUp
            start={start}
            end={end}
            decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
            duration={1}
            onStart={() => {
              setScale(1.25)
              setTimeout(() => setScale(1), 600)
            }}
            separator=","
          />{' '}
          TACO
        </StyledAccountPendingRewardsContainer>
      ) : (
        <span
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'right bottom',
            transition: 'transform 0.5s',
            display: 'inline-block'
          }}
        >
          <CountUp
            start={start}
            end={end}
            decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
            duration={1}
            onStart={() => {
              setScale(1.25)
              setTimeout(() => setScale(1), 600)
            }}
            separator=","
          />
          <small style={{ marginLeft: '4px', opacity: '.5' }}>TACO</small>
        </span>
      )}
    </>
  )
}

const StyledAccountPendingRewardsContainer = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  letter-spacing: 0.4px;
  color: #ffffff;
`

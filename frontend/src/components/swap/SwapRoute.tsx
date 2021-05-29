import { Trade } from '@uniswap/sdk'
import React, { Fragment, memo, useContext } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import QuestionHelper from '../../components/QuestionHelper'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useContext(ThemeContext)
  return (
    <Flex flexWrap="wrap" width="100%" justifyContent="space-between" alignItems="center">
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <TYPE.brownOpacity fontSize={14} fontWeight={400}>
          Route
        </TYPE.brownOpacity>
        <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
      </span>
      <Flex justifyContent="flex-end">
        {trade.route.path.map((token, i, path) => {
          const isLastItem: boolean = i === path.length - 1
          const currency = unwrappedToken(token)
          return (
            <Fragment key={i}>
              <Flex alignItems="end">
                <TYPE.black fontSize={14} color={theme.brown1} ml="0.125rem" mr="0.125rem">
                  {currency.symbol}
                </TYPE.black>
              </Flex>
              {isLastItem ? null : <ChevronRight size={12} color={theme.brown1} />}
            </Fragment>
          )
        })}
      </Flex>
    </Flex>
  )
})

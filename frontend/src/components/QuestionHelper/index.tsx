import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Tooltip from '../Tooltip'
import { ReactComponent as Info } from '../../assets/svg/info.svg'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0 8px;
  background: none;
  outline: none;
  cursor: default;
  background: transparent;
  color: ${({ theme }) => theme.text4};
`

const LightQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.white};
`

const QuestionMark = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.brown1};
  display: flex;
  align-items: center;
`

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <Tooltip text={text} show={show}>
      <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
        <QuestionMark>
          <Info />
        </QuestionMark>
      </QuestionWrapper>
    </Tooltip>
  )
}

export function LightQuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <Tooltip text={text} show={show}>
      <LightQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
        <QuestionMark>?</QuestionMark>
      </LightQuestionWrapper>
    </Tooltip>
  )
}

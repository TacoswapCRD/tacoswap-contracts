import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Row = styled(Box)<{
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => (padding ? padding : '0')};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '')};
`

export const RowBetween = styled(Row)<{ gap?: string; justifyContent?: string; isMobile?: boolean }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : 'space-between')};
  color: ${({ theme }) => theme.brown1};
  & > * {
    margin: ${({ gap }) => gap} !important;
  }
  @media (max-width: 420px) {
    padding: ${({ isMobile }) => isMobile && `0px 10px 17px !important`};
  }
`

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string; flexDirection?: boolean; width?: any }>`
  flex-direction: ${({ flexDirection }) => (flexDirection ? ' column' : 'row')};
  width: ${({ width }) => (width ? width : 'fit-content')};
  margin: ${({ gap }) => gap && `-${gap}`};
`

export default Row

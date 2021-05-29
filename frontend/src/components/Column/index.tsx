import styled from 'styled-components'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
`
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
  width?: string
  radius?: string
  padding?: string
  mobileView?: boolean
  mobilePadding?: string
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
  width: ${({ width }) => width};
  border-radius: ${({ radius }) => radius};
  padding: ${({ padding }) => padding && padding};
  @media (max-width: 422px) {
    background: ${({ mobileView }) => (mobileView ? '#fff' : '')};
  }
  @media (max-width: 420px) {
    padding: ${({ mobilePadding }) => mobilePadding && mobilePadding};
  }
`

export default Column

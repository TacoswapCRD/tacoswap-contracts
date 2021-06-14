import React from 'react'
import LeftMenuLayout from '../components/layout/LeftMenuLayout'

const WithLayout = <P extends object>(
  Component: React.ComponentType<P>,
  minHeight?: boolean,
  title?: string
): React.FC<P> => {
  // eslint-disable-next-line react/display-name
  return (props: P) => (
    <LeftMenuLayout title={title} minHeight={minHeight}>
      <Component {...(props as P)} />
    </LeftMenuLayout>
  )
}

export default WithLayout

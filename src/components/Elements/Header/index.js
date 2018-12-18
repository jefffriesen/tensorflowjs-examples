import React from 'react'
import { headerColor, accentColor } from '../../../utils/constants'
import { Header } from 'semantic-ui-react'

export const PrimaryHeader = ({ children }) => {
  return (
    <Header as='h3' style={headerStyle}>
      {children}
    </Header>
  )
}

const headerStyle = {
  color: headerColor,
  fontWeight: 200,
  paddingLeft: '1rem',
  borderLeft: `1px solid ${accentColor}`,
  textTransform: 'uppercase'
}

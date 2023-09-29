import React from 'react'
import UserDetailPage from './page'

describe('<UserDetailPage />', () => {
  it('renders', () => {
    cy.mount(<UserDetailPage params={{id: 42}} />)
    cy.contains('UserDetailPage 42')
  })
})

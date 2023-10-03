import React from 'react'
import UserDetailPage from './page'

describe('<UserDetailPage />', () => {
  it('should renders valid user', () => {
    cy.mount(<UserDetailPage params={{id: 10}} />)
    cy.contains('UserDetailPage 10')
  })
})

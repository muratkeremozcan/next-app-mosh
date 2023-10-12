import React from 'react'
import NavBar from './NavBar'

describe('<NavBar />', () => {
  it('renders', () => {
    cy.mount(<NavBar />)

    cy.getByCy('navbar-home-link')
    cy.getByCy('navbar-users-link')
    cy.getByCy('navbar-sign-in').click()
    cy.location('pathname').should('equal', '/api/auth/signin')
  })
})

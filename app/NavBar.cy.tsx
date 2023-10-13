import NavBar from './NavBar'
import {SessionProvider} from 'next-auth/react'
import session from '@fixtures/auth-session.json'

describe('<NavBar />', () => {
  it('should show loading and Sign in', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/auth/session',
      },
      {statusCode: 400},
    )
    cy.mount(
      <SessionProvider>
        <NavBar />
      </SessionProvider>,
    )
    cy.contains('Loading...')

    cy.getByCy('navbar-home-link')
    cy.getByCy('navbar-users-link')
    cy.getByCy('navbar-sign-in').should('be.visible')
  })

  it('should show user name when authenticated', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/auth/session',
      },
      {fixture: 'auth-session.json', statusCode: 200},
    )
    cy.mount(
      <SessionProvider>
        <NavBar />
      </SessionProvider>,
    )
    cy.contains('Loading...')

    cy.getByCy('navbar-home-link')
    cy.getByCy('navbar-users-link')
    cy.getByCy('navbar-sign-in').should('not.exist')
    cy.contains(session.user.name).should('be.visible')
  })
})

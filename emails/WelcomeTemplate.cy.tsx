import React from 'react'
import WelcomeTemplate from './WelcomeTemplate'

describe('<WelcomeTemplate />', () => {
  it('renders', () => {
    cy.mount(<WelcomeTemplate name={'Murat'} />)
    cy.contains('Hello Murat').should('be.visible')
    cy.get('a').should('have.attr', 'href', 'https://react-email.js.org')
  })
})

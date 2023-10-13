import session from '@fixtures/auth-session.json'

describe('Login', () => {
  it('should stubLogin', () => {
    cy.stubLogin()
    cy.contains(session.user.name).should('be.visible')
  })

  it('should googleLogin', () => {
    cy.googleLogin()
    // TODO: make this work
    // the next-auth.session-token cookie clears,
    // cy.contains(session.user.name).should('be.visible')
  })
})

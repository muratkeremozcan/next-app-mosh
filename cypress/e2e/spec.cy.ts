describe('e2e sanity', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Hello World')
    cy.contains('Users')
    cy.contains('.btn', /add to cart/i)
  })

  it('should nav to users', () => {
    cy.intercept('GET', '/users?*').as('getUsers')
    cy.contains(/users/i).click()

    cy.wait('@getUsers')
    cy.location('pathname').should('eq', '/users')
    cy.getByCyLike('user-').should('have.length.gt', 0)
  })
})

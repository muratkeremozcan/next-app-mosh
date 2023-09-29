describe('Users route', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Hello World')
    cy.contains('Users')
    cy.contains('.btn', /add to cart/i)
  })

  it('should nav to users', () => {
    // when we are click-navigating to a route, there is a network call,
    // we can stub that network call
    cy.intercept('GET', '/users?*', {fixture: 'users.json'}).as('getUsers')
    cy.contains(/users/i).click()

    cy.wait('@getUsers')
    cy.location('pathname').should('eq', '/users')
    cy.getByCyLike('user-').should('have.length.gt', 0)
  })
})

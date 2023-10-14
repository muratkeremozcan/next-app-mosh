describe('Users route', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Hello')
    cy.contains('Users')
    cy.contains('.btn', /add to cart/i)
    // when we are click-navigating to a route, there is a network call,
    // we can stub that network call
    cy.intercept('GET', '/users?*', {fixture: 'users.json'}).as('getUsers')
  })

  it('should nav to users', () => {
    cy.getByCy('home-page-users-link').click()
    cy.wait('@getUsers')
    cy.location('pathname').should('eq', '/users')
    cy.getByCyLike('user-').should('have.length.gt', 0)
  })

  it('should nav to users via navbar', () => {
    cy.getByCy('navbar-users-link').click()
    cy.wait('@getUsers')
    cy.location('pathname').should('eq', '/users')
    cy.getByCyLike('user-').should('have.length.gt', 0)
  })
})

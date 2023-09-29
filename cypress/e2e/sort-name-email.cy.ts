describe('Sort users', () => {
  beforeEach(() => {
    // when we are direct-navigating to a route,
    // the content is served from the server, as a document
    // we do not see a network call; cy.intercept would not catch anything
    cy.visit('/users')
  })

  it('should sort by name and email', () => {
    cy.location('pathname').should('eq', '/users')

    cy.getByCy('sort-by-name').click()
    cy.location('search').should('eq', '?sortOrder=name')

    cy.getByCy('sort-by-email').click()
    cy.location('search').should('eq', '?sortOrder=email')
  })
})

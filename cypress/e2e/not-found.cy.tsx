describe('Not Found', () => {
  Cypress.on('uncaught:exception', () => false)
  it('should display not found component on an unknown route', () => {
    cy.visit('/asdfasdf', {failOnStatusCode: false})
    cy.contains('The requested page does not exist.')
  })
  it('should display not found component on unknown user', () => {
    cy.visit('/users/11', {failOnStatusCode: false})
    cy.contains('The user is not found.')
  })
})

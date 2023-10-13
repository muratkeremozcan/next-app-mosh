import 'cypress-map'
describe('Login', () => {
  it('should login', () => {
    cy.loginByGoogleApi().tap()
  })
})

import 'cypress-iframe'
describe('upload page', () => {
  it('should invoke the Cloudinary component', () => {
    cy.intercept('GET', 'https://widget.cloudinary.com/info/**').as(
      'cloudinary',
    )
    cy.visit('/upload')
    cy.location('pathname').should('equal', '/upload')
    cy.wait('@cloudinary')
    cy.contains('.btn', /upload an image/i).click()

    cy.get('[data-test="uw-iframe"]').should('be.visible')

    // PROBLEM: Blocked a frame with origin "http://localhost:3000" from accessing a cross-origin frame.
    // cy.frameLoaded('[data-test="uw-iframe"]')
  })
})

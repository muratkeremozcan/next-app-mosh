import UploadPage from './page'
import 'cypress-iframe'

describe('<UploadPage />', () => {
  it('should invoke the Cloudinary component', () => {
    cy.intercept('GET', 'https://widget.cloudinary.com/info/**').as(
      'cloudinary',
    )
    cy.mount(<UploadPage />)
    cy.wait('@cloudinary')

    cy.contains('.btn', /upload an image/i).click()

    // works in ct, problem in e2e; cypress/e2e/upload.cy.tsx
    cy.get('[data-test="uw-iframe"]').should('be.visible')
    cy.frameLoaded('[data-test="uw-iframe"')
    // how can we grab an item in the iframe?
  })
})

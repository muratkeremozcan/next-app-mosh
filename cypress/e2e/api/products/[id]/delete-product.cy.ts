import spok from 'cy-spok'

describe('DELETE product', () => {
  it('should delete a product', () => {
    const id = 5

    cy.api({
      method: 'DELETE',
      url: `/api/products/${id}`,
    }).should(spok({status: 200}))
  })

  it('should delete a product that does not exist', () => {
    const id = 101

    cy.api({
      method: 'DELETE',
      url: `/api/products/${id}`,
      failOnStatusCode: false,
    }).should(spok({status: 404}))
  })
})

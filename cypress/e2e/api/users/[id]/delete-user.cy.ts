import spok from 'cy-spok'

describe('DELETE user', () => {
  it('should delete a user', () => {
    const id = 5

    cy.api({
      method: 'DELETE',
      url: `/api/users/${id}`,
    }).should(spok({status: 200}))
  })

  it('should delete a user that does not exist', () => {
    const id = 101

    cy.api({
      method: 'DELETE',
      url: `/api/users/${id}`,
      failOnStatusCode: false,
    }).should(spok({status: 404}))
  })
})

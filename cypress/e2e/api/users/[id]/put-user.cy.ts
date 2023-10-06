import spok from 'cy-spok'

describe('PUT user', () => {
  it('should put a user', () => {
    const body = {name: 'Astarion'}
    const id = 5

    cy.api({
      method: 'PUT',
      url: `/api/users/${id}`,
      body,
    })
      .should(spok({status: 200}))
      .its('body')
      .should(spok({id, name: body.name}))
  })

  it('should put an invalid user', () => {
    const body = {name: ''}

    cy.api({
      method: 'PUT',
      url: '/api/users/1',
      body,
      failOnStatusCode: false,
    })
      .should(spok({status: 400}))
      .its('body')
      .should(spok({error: 'Name is required'}))
  })

  it('should put a user that does not exist', () => {
    const body = {name: 'Astarion'}
    const id = 101

    cy.api({
      method: 'PUT',
      url: `/api/users/${id}`,
      body,
      failOnStatusCode: false,
    })
      .should(spok({status: 404}))
      .its('body')
      .should(spok({error: 'User not found'}))
  })
})

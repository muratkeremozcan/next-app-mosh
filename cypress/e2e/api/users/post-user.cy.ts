import spok from 'cy-spok'

describe('POST user', () => {
  it('should post user', () => {
    const body = {name: 'Astarion'}

    cy.api({
      method: 'POST',
      url: '/api/users',
      body,
    })
      .should(spok({status: 201}))
      .its('body')
      .should(spok({id: spok.number, name: body.name}))
  })

  it('should post an invalid user', () => {
    const body = {name: ''}

    cy.api({
      method: 'POST',
      url: '/api/users',
      body,
      failOnStatusCode: false,
    })
      .should(spok({status: 400}))
      .its('body')
      .should(spok({error: 'Name is required'}))
  })
})

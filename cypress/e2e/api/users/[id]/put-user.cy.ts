import spok from 'cy-spok'

describe('PUT user', () => {
  it('should put a user', () => {
    const body = {name: 'Murat', email: 'ast@gmail.com', id: 5}
    const {name, id} = body

    cy.api({
      method: 'PUT',
      url: `/api/users/${id}`,
      body,
    })
      .should(spok({status: 200}))
      .its('body')
      .should(spok({id, name}))
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
      .should(
        spok([
          {
            code: 'too_small',
            minimum: 3,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'String must contain at least 3 character(s)',
            path: ['name'],
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['email'],
            message: 'Required',
          },
        ]),
      )
  })

  it('should put a user that does not exist', () => {
    const body = {name: 'Murat', email: 'ast@gmail.com', id: 101}
    const {id} = body

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

import spok from 'cy-spok'

describe('POST user', () => {
  it('should post user', () => {
    const body = {name: 'Murat', email: 'ast@gmail.com'}
    const {name} = body

    cy.api({
      method: 'POST',
      url: '/api/users',
      body,
    })
      .should(spok({status: 201}))
      .its('body')
      .should(spok({id: spok.number, name}))
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
})

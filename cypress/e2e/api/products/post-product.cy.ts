import spok from 'cy-spok'

describe('POST product', () => {
  it('should post product', () => {
    const body = {name: 'Milk', price: 5}
    const {name, price} = body

    cy.api({
      method: 'POST',
      url: '/api/products',
      body,
    })
      .should(spok({status: 201}))
      .its('body')
      .should(spok({id: spok.number, name, price}))
  })

  it.only('should post an invalid product', () => {
    const body = {name: ''}

    cy.api({
      method: 'POST',
      url: '/api/products',
      body,
      failOnStatusCode: false,
    })
      .should(spok({status: 400}))
      .its('body')
      .should(
        spok([
          {
            code: 'too_small',
            minimum: 2,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'String must contain at least 2 character(s)',
            path: ['name'],
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['price'],
            message: 'Required',
          },
        ]),
      )
  })
})

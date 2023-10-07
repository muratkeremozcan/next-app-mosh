import spok from 'cy-spok'

describe('PUT product', () => {
  it('should put a product', () => {
    const body = {name: 'Milk', price: 5, id: 5}
    const {name, id} = body

    cy.api({
      method: 'PUT',
      url: `/api/products/${id}`,
      body,
    })
      .should(spok({status: 200}))
      .its('body')
      .should(spok({id, name}))
  })

  it('should put an invalid product', () => {
    const body = {name: ''}

    cy.api({
      method: 'PUT',
      url: '/api/products/1',
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

  it('should put a product that does not exist', () => {
    const body = {name: 'Milk', price: 5, id: 101}
    const {id} = body

    cy.api({
      method: 'PUT',
      url: `/api/products/${id}`,
      body,
      failOnStatusCode: false,
    })
      .should(spok({status: 404}))
      .its('body')
      .should(spok({error: 'Product not found'}))
  })
})
